import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

// Models
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent {
  @Input() account!: Account;
  @Input() showActions = true;
  @Input() compact = false;
  
  @Output() deposit = new EventEmitter<Account>();
  @Output() withdraw = new EventEmitter<Account>();
  @Output() viewDetails = new EventEmitter<Account>();
  @Output() editAccount = new EventEmitter<Account>();
  @Output() deleteAccount = new EventEmitter<Account>();

  onDeposit(event: Event): void {
    event.stopPropagation();
    this.deposit.emit(this.account);
  }

  onWithdraw(event: Event): void {
    event.stopPropagation();
    this.withdraw.emit(this.account);
  }

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit(this.account);
  }

  onEditAccount(event: Event): void {
    event.stopPropagation();
    this.editAccount.emit(this.account);
  }

  onDeleteAccount(event: Event): void {
    event.stopPropagation();
    this.deleteAccount.emit(this.account);
  }

  getAccountIcon(): string {
    switch (this.account.type) {
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

  getStatusColor(): string {
    switch (this.account.status?.toLowerCase()) {
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

  getBalanceColor(): string {
    if (this.account.balance < 0) {
      return 'text-red-600';
    } else if (this.account.balance === 0) {
      return 'text-gray-600';
    } else {
      return 'text-green-600';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatAccountNumber(accountNumber: string): string {
    // Format account number as ****-****-1234
    if (accountNumber.length >= 4) {
      const lastFour = accountNumber.slice(-4);
      return `****-****-${lastFour}`;
    }
    return accountNumber;
  }
}