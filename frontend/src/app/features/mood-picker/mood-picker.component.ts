import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MoodOption } from '../../core/models/models';

@Component({
  selector: 'app-mood-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mood-picker.component.html',
  styleUrls: ['./mood-picker.component.css']
})
export class MoodPickerComponent {

  @Input() humorSelecionado: string | undefined;
  @Output() humorEscolhido = new EventEmitter<string>();

  readonly opcoes: MoodOption[] = [
    { emoji: '😀', label: 'Feliz' },
    { emoji: '😢', label: 'Triste' },
    { emoji: '😡', label: 'Bravo(a)' },
    { emoji: '😴', label: 'Cansado(a)' },
    { emoji: '😍', label: 'Apaixonado(a)' }
  ];

  escolher(opcao: MoodOption): void {
    this.humorEscolhido.emit(opcao.emoji);
  }
}
