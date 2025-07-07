import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, RegisterRequest, UserRole } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
  
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public users$ = this.usersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(users => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          this.errorSubject.next(error.error?.message || 'Failed to load users');
          this.loadingSubject.next(false);
        }
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.getUsers(); // Alias for getUsers
  }

  getUser(id: number): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      tap({
        error: (error) => {
          this.errorSubject.next(error.error?.message || 'Failed to load user');
          this.loadingSubject.next(false);
        }
      })
    );
  }

  createUser(userData: RegisterRequest): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.post<User>(this.apiUrl, userData).pipe(
      tap(newUser => {
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          this.errorSubject.next(error.error?.message || 'Failed to create user');
          this.loadingSubject.next(false);
        }
      })
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData).pipe(
      tap(updatedUser => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.map(user => 
          user.id === id ? updatedUser : user
        );
        this.usersSubject.next(updatedUsers);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          this.errorSubject.next(error.error?.message || 'Failed to update user');
          this.loadingSubject.next(false);
        }
      })
    );
  }

  updateUserStatus(id: number, status: 'active' | 'inactive'): Observable<User> {
    return this.updateUser(id, { status });
  }

  updateUserRole(id: number, role: UserRole): Observable<User> {
    return this.updateUser(id, { role });
  }

  deleteUser(id: number): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.filter(user => user.id !== id);
        this.usersSubject.next(updatedUsers);
        this.loadingSubject.next(false);
      }),
      tap({
        error: (error) => {
          this.errorSubject.next(error.error?.message || 'Failed to delete user');
          this.loadingSubject.next(false);
        }
      })
    );
  }
}
