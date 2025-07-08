import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated && this.authService.isClient) {
      return true;
    }
    
    // Redirect to appropriate page based on role
    if (this.authService.isAuthenticated) {
      const redirectPath = this.authService.getDefaultRedirectPath();
      this.router.navigate([redirectPath]);
    } else {
      this.router.navigate(['/login']);
    }
    
    return false;
  }
}
