import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'diario', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./features/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'diario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/diary-page/diary-page.component').then((m) => m.DiaryPageComponent)
  },
  {
    path: 'admin/logs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin-logs/admin-logs.component').then((m) => m.AdminLogsComponent)
  },
  { path: '**', redirectTo: 'diario' }
];
