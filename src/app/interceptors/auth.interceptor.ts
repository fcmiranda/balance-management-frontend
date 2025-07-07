import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('client-balance-jwt');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('client-balance-jwt');
          this.router.navigate(['/login']);
          this.snackBar.open('Session expired. Please login again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        } else if (error.status === 403) {
          this.snackBar.open('Access denied. You do not have permission to perform this action.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        } else if (error.status === 429) {
          this.snackBar.open('Too many requests. Please try again later.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
        
        return throwError(() => error);
      })
    );
  }
}
