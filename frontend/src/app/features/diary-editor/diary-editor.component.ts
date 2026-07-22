import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { DiaryService } from '../../core/services/diary.service';
import { Diario } from '../../core/models/models';
import { MoodPickerComponent } from '../mood-picker/mood-picker.component';

@Component({
  selector: 'app-diary-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MoodPickerComponent],
  templateUrl: './diary-editor.component.html',
  styleUrls: ['./diary-editor.component.css']
})
export class DiaryEditorComponent implements OnChanges {

  @Input({ required: true }) dataSelecionada!: string;

  diarioAtual: Diario | null = null;
  texto = '';
  humor: string | undefined;
  fotosPendentes: { previewUrl: string; arquivo: File }[] = [];

  carregando = false;
  salvando = false;
  excluindo = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(private diaryService: DiaryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSelecionada']) {
      this.carregarAnotacaoDoDia();
    }
  }

  get dataFormatadaExibicao(): string {
    if (!this.dataSelecionada) return '';
    const [ano, mes, dia] = this.dataSelecionada.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  carregarAnotacaoDoDia(): void {
    this.limparMensagens();
    this.carregando = true;

    this.diaryService.buscarPorData(this.dataSelecionada)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (resultados) => {
          this.diarioAtual = resultados[0] ?? null;
          this.texto = this.diarioAtual?.conteudoTexto ?? '';
          this.humor = this.diarioAtual?.emojiHumor;
          this.fotosPendentes = [];
        },
        error: () => (this.mensagemErro = 'Não foi possível carregar a anotação deste dia.')
      });
  }

  selecionarHumor(emoji: string): void {
    this.humor = emoji;
  }

  aoSelecionarArquivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((arquivo) => {
      const leitor = new FileReader();
      leitor.onload = () => {
        this.fotosPendentes.push({ previewUrl: leitor.result as string, arquivo });
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  removerFotoPendente(index: number): void {
    this.fotosPendentes.splice(index, 1);
  }

  salvar(): void {
    if (!this.texto.trim()) {
      this.mensagemErro = 'Escreva algo antes de salvar :)';
      return;
    }

    this.limparMensagens();
    this.salvando = true;

    // NOTA: em produção, faça o upload de `fotosPendentes` para o
    // S3/Cloudinary primeiro (endpoint próprio) e envie apenas as URLs
    // resultantes aqui, dentro do array `fotos`.
    const payload: Diario = {
      data: this.dataSelecionada,
      conteudoTexto: this.texto,
      emojiHumor: this.humor,
      fotos: this.diarioAtual?.fotos ?? []
    };

    const operacao$ = this.diarioAtual?.id
      ? this.diaryService.atualizar(this.diarioAtual.id, payload)
      : this.diaryService.criar(payload);

    operacao$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: (resultado) => {
        this.diarioAtual = resultado;
        this.mensagemSucesso = 'Página do diário salva com carinho 💜';
      },
      error: () => (this.mensagemErro = 'Não foi possível salvar sua anotação. Tente novamente.')
    });
  }

  excluir(): void {
    if (!this.diarioAtual?.id) return;
    if (!confirm('Tem certeza que deseja excluir esta página do diário?')) return;

    this.limparMensagens();
    this.excluindo = true;

    this.diaryService.excluir(this.diarioAtual.id)
      .pipe(finalize(() => (this.excluindo = false)))
      .subscribe({
        next: () => {
          this.diarioAtual = null;
          this.texto = '';
          this.humor = undefined;
          this.mensagemSucesso = 'Página excluída.';
        },
        error: () => (this.mensagemErro = 'Não foi possível excluir esta anotação.')
      });
  }

  private limparMensagens(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}
