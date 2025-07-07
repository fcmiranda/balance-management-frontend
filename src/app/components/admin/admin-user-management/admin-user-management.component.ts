import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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

// Services and Models
import { UserService } from '../../../services/user.service';
import { User, UserRole } from '../../../models/auth.model';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    MatDividerModule
  ],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.scss']
})
export class AdminUserManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'id', 
    'name', 
    'email', 
    'role', 
    'status', 
    'createdAt', 
    'lastLogin',
    'actions'
  ];
  
  filterForm: FormGroup;
  loading = false;
  error: string | null = null;
  
  roles: UserRole[] = ['client', 'admin'];
  statuses = ['active', 'inactive', 'suspended'];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      role: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.setupFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilter(): void {
    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilter();
    });
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getAllUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        this.snackBar.open('Failed to load users', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private applyFilter(): void {
    const filterValues = this.filterForm.value;
    
    this.dataSource.filterPredicate = (user: User, filter: string) => {
      const searchTerm = filterValues.search.toLowerCase();
      const roleFilter = filterValues.role;
      const statusFilter = filterValues.status;
      
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);
      
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    };
    
    this.dataSource.filter = 'trigger';
  }

  onRefresh(): void {
    this.loadUsers();
  }

  onClearFilters(): void {
    this.filterForm.reset();
  }

  onEditUser(user: User): void {
    // TODO: Implement edit user dialog
    this.snackBar.open('Edit user functionality coming soon', 'Close', {
      duration: 2000
    });
  }

  onToggleUserStatus(user: User): void {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    this.userService.updateUserStatus(user.id, newStatus).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        user.status = newStatus;
        this.snackBar.open(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to update user status', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onChangeUserRole(user: User): void {
    const newRole = user.role === 'admin' ? 'client' : 'admin';
    
    this.userService.updateUserRole(user.id, newRole).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        user.role = newRole;
        this.snackBar.open(`User role changed to ${newRole}`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to update user role', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onDeleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.userService.deleteUser(user.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete user', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getRoleColor(role: UserRole): string {
    return role === 'admin' ? 'primary' : 'accent';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'primary';
      case 'inactive':
        return 'warn';
      case 'suspended':
        return 'accent';
      default:
        return 'primary';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}