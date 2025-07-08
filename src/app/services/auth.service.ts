import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { ErrorMappingService } from './error-mapping.service';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'client-balance-jwt';
  
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public user$ = this.userSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorMappingService: ErrorMappingService
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const user = this.decodeUserFromToken(token);
        this.userSubject.next(user);
      } catch (error) {
        // Token inválido ou expirado
        this.logout();
      }
    }
  }

  private decodeUserFromToken(token: string): User {
    const decoded: any = jwtDecode(token);
    
    // Verificar se o token não está expirado
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      throw new Error('Token expired');
    }
    
    return {
      id: decoded.id || decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      status: decoded.status || 'active',
      createdAt: decoded.createdAt || new Date().toISOString(),
      updatedAt: decoded.updatedAt || new Date().toISOString()
    };
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.userSubject.next(response.user as User);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.loadingSubject.next(false);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.userSubject.next(response.user as User);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          const errorMessage = this.errorMappingService.mapHttpError(error);
          this.errorSubject.next(errorMessage);
          this.loadingSubject.next(false);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.errorSubject.next(null);
  }

  get isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return false;
    }
    
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Verificar se o token não está expirado
      if (decoded.exp && decoded.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return !!this.userSubject.value;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get isClient(): boolean {
    return this.currentUser?.role === 'client';
  }

  getDefaultRedirectPath(): string {
    if (this.isAdmin) {
      return '/admin/users';
    } else if (this.isClient) {
      return '/accounts';
    } else {
      return '/dashboard';
    }
  }
}
