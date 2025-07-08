import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMappingService } from '../services/error-mapping.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const errorMappingService = inject(ErrorMappingService);
  
  const token = localStorage.getItem('client-balance-jwt');
  
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Mapeia a mensagem de erro para português
      const errorMessage = errorMappingService.mapByStatusCode(error.status, error.error?.message || error.message);
      
      if (error.status === 401) {
        localStorage.removeItem('client-balance-jwt');
        router.navigate(['/login']);
        snackBar.open(errorMessage, 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      } else if (error.status === 403) {
        snackBar.open(errorMessage, 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      } else if (error.status === 429) {
        snackBar.open(errorMessage, 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      } else {
        // Para outros erros, também mostra a mensagem traduzida
        snackBar.open(errorMessage, 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
      
      return throwError(() => error);
    })
  );
};
