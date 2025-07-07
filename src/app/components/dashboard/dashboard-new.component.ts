import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services and Models
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';
import { User } from '../../models/auth.model';

// Components
import { AccountCardComponent } from '../ui/account-card/account-card.component';
import { CreateAccountDialogComponent } from '../create-account-dialog/create-account-dialog.component';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    AccountCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  accounts: Account[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.error = null;

    this.accountService.getAccounts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
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

  get totalBalance(): number {
    return this.accounts.reduce((total, account) => total + account.balance, 0);
  }

  get activeAccountsCount(): number {
    return this.accounts.filter(account => account.status === 'active').length;
  }

  openCreateAccountDialog(): void {
    const dialogRef = this.dialog.open(CreateAccountDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  onDeposit(account: Account): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '400px',
      data: {
        type: 'deposit',
        accountId: account.id,
        accountNumber: account.accountNumber,
        currentBalance: account.balance
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  onWithdraw(account: Account): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '400px',
      data: {
        type: 'withdraw',
        accountId: account.id,
        accountNumber: account.accountNumber,
        currentBalance: account.balance
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAccounts();
      }
    });
  }

  onViewDetails(account: Account): void {
    this.router.navigate(['/account', account.id]);
  }

  onEditAccount(account: Account): void {
    this.snackBar.open('Edit account functionality coming soon', 'Close', {
      duration: 2000
    });
  }

  onDeleteAccount(account: Account): void {
    if (confirm(`Are you sure you want to delete account ${account.accountNumber}?`)) {
      this.accountService.deleteAccount(account.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.loadAccounts();
          this.snackBar.open('Account deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete account', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
