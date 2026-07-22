import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { LogAcesso } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WebsocketService {

  private client: Client | null = null;

  /** Feed reativo com os logs recebidos em tempo real (mais recente primeiro) */
  logs = signal<LogAcesso[]>([]);
  conectado = signal(false);

  constructor(private authService: AuthService) {}

  conectar(): void {
    if (this.client?.active) return;

    const token = this.authService.getToken();

    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => {
        this.conectado.set(true);
        this.client?.subscribe('/topic/logs', (message: IMessage) => {
          const novoLog: LogAcesso = JSON.parse(message.body);
          this.logs.update((atuais) => [novoLog, ...atuais].slice(0, 100));
        });
      },
      onDisconnect: () => this.conectado.set(false),
      onStompError: () => this.conectado.set(false)
    });

    this.client.activate();
  }

  desconectar(): void {
    this.client?.deactivate();
    this.conectado.set(false);
  }
}
