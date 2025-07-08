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
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

// Services and Models
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { Account } from '../../../models/account.model';
import { TransactionDialogComponent } from '../../ui/transaction-dialog/transaction-dialog.component';

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
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss']
})
export class UserAccountsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dataSource = new MatTableDataSource<Account>();
  displayedColumns: string[] = [
    'id',
    'accountNumber', 
    'balance', 
    'createdAt',
    'actions'
  ];
  
  accounts: Account[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
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
        this.error = 'Falha ao carregar contas';
        this.loading = false;
        this.snackBar.open('Falha ao carregar contas', 'Fechar', {
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
        this.snackBar.open('Conta criada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadAccounts();
      },
      error: (error) => {
        this.snackBar.open('Falha ao criar conta', 'Fechar', {
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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
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

  getAccountIcon(account: Account): string {
    switch (account.type) {
      case 'checking':
        return 'credit_card';
      case 'savings':
        return 'savings';
      case 'business':
        return 'business';
      default:
        return 'account_balance_wallet';
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

  onDeposit(account: Account): void {
    this.openTransactionDialog(account, 'deposit');
  }

  onWithdraw(account: Account): void {
    this.openTransactionDialog(account, 'withdraw');
  }

  private openTransactionDialog(account: Account, type: 'withdraw' | 'deposit'): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '500px',
      data: {
        title: type === 'deposit' ? 'Depositar Fundos' : 'Sacar Fundos',
        message: `${type === 'deposit' ? 'Adicionar fundos à' : 'Sacar fundos da'} sua conta ${this.formatAccountNumber(account.accountNumber)}`,
        type: type,
        accountNumber: account.accountNumber
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processTransaction(result, account.id, type);
      }
    });
  }

  private processTransaction(transaction: { amount: number }, accountId: number, type: 'withdraw' | 'deposit'): void {
    
    if (type === 'withdraw') {
      this.accountService.withdraw(accountId, transaction.amount).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (updatedAccount) => {
          this.snackBar.open(
            `Saque de ${this.formatCurrency(transaction.amount)} processado com sucesso!`, 
            'Fechar', 
            { duration: 5000, panelClass: ['success-snackbar'] }
          );
          this.loadAccounts();
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Falha no saque', 
            'Fechar', 
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        }
      });
    } else if (type === 'deposit') {
      this.accountService.deposit(accountId, transaction.amount).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (updatedAccount) => {
          this.snackBar.open(
            `Depósito de ${this.formatCurrency(transaction.amount)} processado com sucesso!`, 
            'Fechar', 
            { duration: 5000, panelClass: ['success-snackbar'] }
          );
          this.loadAccounts();
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Falha no depósito', 
            'Fechar', 
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        }
      });
    }
  }
}
