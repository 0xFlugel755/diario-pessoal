import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LogAcesso } from '../../core/models/models';
import { WebsocketService } from '../../core/services/websocket.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css']
})
export class AdminLogsComponent implements OnInit, OnDestroy {

  historico: LogAcesso[] = [];

  constructor(
    public websocketService: WebsocketService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Carrega o histórico recente via REST e depois liga o "ao vivo" via WebSocket
    this.http.get<LogAcesso[]>(`${environment.apiUrl}/admin/logs`).subscribe({
      next: (logs) => (this.historico = logs),
      error: () => (this.historico = [])
    });

    this.websocketService.conectar();
  }

  ngOnDestroy(): void {
    this.websocketService.desconectar();
  }

  get logsCombinados(): LogAcesso[] {
    const idsAoVivo = new Set(this.websocketService.logs().map((l) => l.id));
    const historicoSemDuplicados = this.historico.filter((l) => !idsAoVivo.has(l.id));
    return [...this.websocketService.logs(), ...historicoSemDuplicados].slice(0, 100);
  }
}
