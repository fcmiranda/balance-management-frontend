import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services and Models
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-user-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss']
})
export class UserAccountsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dataSource = new MatTableDataSource<Account>();
  displayedColumns: string[] = [
    'accountNumber', 
    'balance', 
    'createdAt'
  ];
  
  accounts: Account[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAccounts(): void {
    this.loading = true;
    this.error = null;
    
    this.accountService.getAccounts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.dataSource.data = accounts;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load accounts';
        this.loading = false;
        this.snackBar.open('Failed to load accounts', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onRefresh(): void {
    this.loadAccounts();
  }

  onCreateAccount(): void {
    this.accountService.createAccount().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (newAccount) => {
        this.snackBar.open('Account created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadAccounts();
      },
      error: (error) => {
        this.snackBar.open('Failed to create account', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  get totalBalance(): number {
    return this.accounts.reduce((total, account) => total + account.balance, 0);
  }

  get monthlyActivity(): number {
    // This would typically come from the API with actual transaction data
    return 0; // Placeholder
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatAccountNumber(accountNumber: string): string {
    // Format as XXXX-XXXX-XXXX
    return accountNumber.replace(/(.{4})/g, '$1-').slice(0, -1);
  }

  getBalanceColor(balance: number): string {
    if (balance < 0) {
      return 'text-red-600';
    } else if (balance === 0) {
      return 'text-gray-600';
    } else {
      return 'text-green-600';
    }
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
