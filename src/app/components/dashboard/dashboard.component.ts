import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/auth.model';
import { Account } from '../../models/account.model';
import { AccountCardComponent } from '../ui/account-card/account-card.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AccountCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  user: User | null = null;
  accounts: Account[] = [];
  loading = true;
  error: string | null = null;
  totalBalance = 0;
  accountCount = 0;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData() {
    this.loading = true;
    this.error = null;
    
    forkJoin({
      user: this.authService.getCurrentUser(),
      accounts: this.accountService.getAccounts()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ user, accounts }) => {
        this.user = user;
        this.accounts = accounts;
        this.calculateTotals();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.loading = false;
      }
    });
  }

  private calculateTotals() {
    this.accountCount = this.accounts.length;
    this.totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  getRoleColor(): string {
    return this.user?.role === 'admin' ? 'warn' : 'primary';
  }

  get currentUser(): User | null {
    return this.user;
  }

  get activeAccountsCount(): number {
    return this.accounts.filter(account => account.status !== 'inactive').length;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  loadDashboard(): void {
    this.loadDashboardData();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAccounts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.calculateTotals();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.error = 'Failed to load accounts. Please try again.';
        this.loading = false;
      }
    });
  }

  onDeposit(account: Account): void {
    // TODO: Implement deposit functionality
    console.log('Deposit to account:', account);
  }

  onWithdraw(account: Account): void {
    // TODO: Implement withdraw functionality
    console.log('Withdraw from account:', account);
  }

  onViewDetails(account: Account): void {
    // TODO: Implement view details functionality
    console.log('View details for account:', account);
  }

  onEditAccount(account: Account): void {
    // TODO: Implement edit account functionality
    console.log('Edit account:', account);
  }

  onDeleteAccount(account: Account): void {
    // TODO: Implement delete account functionality
    console.log('Delete account:', account);
  }
}