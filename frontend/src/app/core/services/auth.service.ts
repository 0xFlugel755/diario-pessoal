import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/models';

const TOKEN_KEY = 'diario_token';
const USER_KEY = 'diario_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  /** Signal reativo com o nome do usuário logado (ou null) */
  usuarioLogado = signal<string | null>(this.lerUsuarioSalvo());

  constructor(private http: HttpClient) {}

  registrar(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/registrar`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((resposta) => {
        localStorage.setItem(TOKEN_KEY, resposta.token);
        localStorage.setItem(USER_KEY, resposta.nome);
        this.usuarioLogado.set(resposta.nome);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.usuarioLogado.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  private lerUsuarioSalvo(): string | null {
    return localStorage.getItem(USER_KEY);
  }
}
