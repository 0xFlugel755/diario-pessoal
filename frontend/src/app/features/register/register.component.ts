import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  nome = '';
  username = '';
  email = '';
  senha = '';
  carregando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.carregando = true;

    this.authService.registrar({
      nome: this.nome,
      username: this.username,
      email: this.email,
      senha: this.senha
    })
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: () => {
          this.mensagemSucesso = 'Conta criada! Redirecionando para o login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.mensagemErro = err?.error?.mensagem ?? 'Não foi possível criar a conta.';
        }
      });
  }
}
