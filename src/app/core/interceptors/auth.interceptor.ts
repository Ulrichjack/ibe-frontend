import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si on a un token ET que la requête nécessite d'être admin
  // (Toutes les requêtes sauf GET vers formations, gallery, testimonials)
  // On vérifie exactement les routes publiques
  const isPublicGet = req.method === 'GET' && 
    (req.url.endsWith('/formations/actives') || 
     req.url.includes('/formations/slug/') || 
     req.url.endsWith('/gallery') || 
     req.url.endsWith('/testimonials')); // Ne matche pas /testimonials/admin !
     
  const isPublicPost = req.method === 'POST' &&
    (req.url.includes('/messages') || req.url.includes('/newsletter'));

  if (token && !isPublicGet && !isPublicPost) {
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Basic ${token}` }
    });
    return next(clonedReq);
  }

  return next(req);
};
