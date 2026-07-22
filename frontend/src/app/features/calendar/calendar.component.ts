import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

interface DiaCalendario {
  data: Date;
  numero: number;
  outroMes: boolean;
  hoje: boolean;
  selecionado: boolean;
  temAnotacao: boolean;
  emoji?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges {

  /** Data atualmente selecionada (formato YYYY-MM-DD) */
  @Input() dataSelecionada: string = this.formatarData(new Date());

  /** Mapa de data (YYYY-MM-DD) -> emoji de humor, para mostrar no dia */
  @Input() emojisPorData: Record<string, string> = {};

  @Output() dataEscolhida = new EventEmitter<string>();

  mesAtual = new Date();
  dias: DiaCalendario[] = [];

  readonly nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  readonly nomesDiasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  ngOnChanges(): void {
    this.gerarDias();
  }

  ngOnInit(): void {
    this.gerarDias();
  }

  mesAnterior(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() - 1, 1);
    this.gerarDias();
  }

  proximoMes(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.gerarDias();
  }

  selecionar(dia: DiaCalendario): void {
    const dataFormatada = this.formatarData(dia.data);
    this.dataEscolhida.emit(dataFormatada);
  }

  private gerarDias(): void {
    const ano = this.mesAtual.getFullYear();
    const mes = this.mesAtual.getMonth();

    const primeiroDiaDoMes = new Date(ano, mes, 1);
    const inicioGrade = new Date(primeiroDiaDoMes);
    inicioGrade.setDate(inicioGrade.getDate() - primeiroDiaDoMes.getDay());

    const hoje = this.formatarData(new Date());
    const dias: DiaCalendario[] = [];

    for (let i = 0; i < 42; i++) {
      const data = new Date(inicioGrade);
      data.setDate(inicioGrade.getDate() + i);
      const dataFormatada = this.formatarData(data);

      dias.push({
        data,
        numero: data.getDate(),
        outroMes: data.getMonth() !== mes,
        hoje: dataFormatada === hoje,
        selecionado: dataFormatada === this.dataSelecionada,
        temAnotacao: !!this.emojisPorData[dataFormatada],
        emoji: this.emojisPorData[dataFormatada]
      });
    }

    this.dias = dias;
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
