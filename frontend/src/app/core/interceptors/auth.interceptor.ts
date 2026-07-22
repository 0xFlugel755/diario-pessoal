import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Só anexa o token para chamadas à nossa própria API (evita vazar o
  // JWT para serviços de terceiros, como o próprio Cloudinary).
  const chamaNossaApi = req.url.startsWith(environment.apiUrl) || req.url.startsWith(environment.wsUrl);

  if (token && chamaNossaApi) {
    const clone = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clone);
  }

  return next(req);
};
