import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services and Models
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/auth.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './admin-user-management.component.html',
})
export class AdminUserManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'id', 
    'name', 
    'email', 
    'role', 
    'createdAt', 
    'actions'
  ];
  
  loading = false;
  error: string | null = null;
  
  roles: UserRole[] = ['client', 'admin'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getAllUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Falha ao carregar usuários';
        this.loading = false;
        this.snackBar.open('Falha ao carregar usuários', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onRefresh(): void {
    this.loadUsers();
  }


  onEditUser(user: User): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir o usuário ${user.name}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        dialogType: 'danger'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('Usuário excluído com sucesso', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.snackBar.open('Falha ao excluir usuário', 'Fechar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  getRoleColor(role: UserRole): string {
    return role === 'admin' ? 'primary' : 'accent';
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on server, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }
}