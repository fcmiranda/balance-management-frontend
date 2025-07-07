import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// Services and Models
import { AccountService } from '../../services/account.service';
import { Account, Transaction } from '../../models/account.model';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  account: Account | null = null;
  transactions: Transaction[] = [];
  loading = false;
  error: string | null = null;
  
  displayedColumns: string[] = ['date', 'type', 'amount', 'description', 'balance'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccountDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAccountDetails(): void {
    this.loading = true;
    this.error = null;

    this.route.params.pipe(
      switchMap(params => {
        const accountId = params['id'];
        return this.accountService.getAccountById(accountId);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (account) => {
        this.account = account;
        this.loadTransactions();
      },
      error: (error) => {
        this.error = 'Failed to load account details';
        this.loading = false;
        this.snackBar.open('Failed to load account details', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private loadTransactions(): void {
    if (!this.account) return;

    this.accountService.getTransactions(this.account.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
        this.snackBar.open('Failed to load transactions', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onRefresh(): void {
    this.loadAccountDetails();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }


  getTransactionTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'deposit':
        return 'text-green-600';
      case 'withdraw':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}