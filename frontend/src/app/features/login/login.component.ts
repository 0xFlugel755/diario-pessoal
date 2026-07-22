import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  senha = '';
  carregando = false;
  mensagemErro = '';

  constructor(private authService: AuthService, private router: Router) {}

  entrar(): void {
    this.mensagemErro = '';
    this.carregando = true;

    this.authService.login({ username: this.username, senha: this.senha })
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: () => this.router.navigate(['/diario']),
        error: () => (this.mensagemErro = 'Usuário ou senha inválidos.')
      });
  }
}
