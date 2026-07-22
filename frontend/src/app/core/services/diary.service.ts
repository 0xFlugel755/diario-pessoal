import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Diario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DiaryService {

  private readonly baseUrl = `${environment.apiUrl}/diarios`;

  constructor(private http: HttpClient) {}

  criar(diario: Diario): Observable<Diario> {
    return this.http.post<Diario>(this.baseUrl, diario);
  }

  listar(inicio?: string, fim?: string): Observable<Diario[]> {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fim) params = params.set('fim', fim);
    return this.http.get<Diario[]>(this.baseUrl, { params });
  }

  buscarPorId(id: string): Observable<Diario> {
    return this.http.get<Diario>(`${this.baseUrl}/${id}`);
  }

  /** Busca a anotação do dia (ou retorna vazio se ainda não existir) */
  buscarPorData(data: string): Observable<Diario[]> {
    return this.listar(data, data);
  }

  atualizar(id: string, diario: Diario): Observable<Diario> {
    return this.http.put<Diario>(`${this.baseUrl}/${id}`, diario);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
