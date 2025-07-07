import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  
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
      if (error.status === 401) {
        localStorage.removeItem('client-balance-jwt');
        router.navigate(['/login']);
        snackBar.open('Session expired. Please login again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      } else if (error.status === 403) {
        snackBar.open('Access denied. You do not have permission to perform this action.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      } else if (error.status === 429) {
        snackBar.open('Too many requests. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
      
      return throwError(() => error);
    })
  );
};
