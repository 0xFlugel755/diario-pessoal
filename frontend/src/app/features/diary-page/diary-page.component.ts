import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { DiaryEditorComponent } from '../diary-editor/diary-editor.component';
import { DiaryService } from '../../core/services/diary.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-diary-page',
  standalone: true,
  imports: [CommonModule, CalendarComponent, DiaryEditorComponent],
  templateUrl: './diary-page.component.html',
  styleUrls: ['./diary-page.component.css']
})
export class DiaryPageComponent implements OnInit {

  dataSelecionada = this.formatarData(new Date());
  emojisPorData: Record<string, string> = {};

  constructor(
    private diaryService: DiaryService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarEmojisDoMes();
  }

  selecionarData(data: string): void {
    this.dataSelecionada = data;
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private carregarEmojisDoMes(): void {
    // Carrega todos os registros do usuário para exibir os emojis no calendário
    this.diaryService.listar().subscribe({
      next: (diarios) => {
        const mapa: Record<string, string> = {};
        diarios.forEach((d) => {
          if (d.emojiHumor) mapa[d.data] = d.emojiHumor;
        });
        this.emojisPorData = mapa;
      }
    });
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
