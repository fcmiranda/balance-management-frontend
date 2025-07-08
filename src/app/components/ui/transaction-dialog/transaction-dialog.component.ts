import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Models
import { Account } from '../../../models/account.model';

export interface TransactionDialogData {
  account: Account;
  type: 'deposit' | 'withdraw';
}

export interface TransactionDialogResult {
  amount: number;
  description?: string;
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent {
  transactionForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData
  ) {
    this.transactionForm = this.createForm();
  }

  private createForm(): FormGroup {
    const validators = [Validators.required, Validators.min(0.01)];
    
    // Add max validator for withdrawals
    if (this.data.type === 'withdraw') {
      validators.push(Validators.max(this.data.account.balance));
    }

    return this.fb.group({
      amount: ['', validators],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.loading = true;
      
      const result: TransactionDialogResult = {
        amount: this.transactionForm.value.amount,
        description: this.transactionForm.value.description || undefined
      };

      // Simulate a short delay to show loading state
      setTimeout(() => {
        this.dialogRef.close(result);
      }, 500);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTransactionAmount(): number {
    return this.transactionForm.get('amount')?.value || 0;
  }

  getDescriptionLength(): number {
    return this.transactionForm.get('description')?.value?.length || 0;
  }

  getNewBalance(): number {
    const amount = this.getTransactionAmount();
    return this.data.type === 'deposit' 
      ? this.data.account.balance + amount 
      : this.data.account.balance - amount;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatAccountNumber(accountNumber: string): string {
    // Format as XXXX-XXXX-XXXX
    return accountNumber.replace(/(.{4})/g, '$1-').slice(0, -1);
  }

  getAccountIcon(): string {
    switch (this.data.account.type) {
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

  getBalanceColor(): string {
    if (this.data.account.balance < 0) {
      return 'text-red-600';
    } else if (this.data.account.balance === 0) {
      return 'text-gray-600';
    } else {
      return 'text-green-600';
    }
  }

  getNewBalanceColor(): string {
    const newBalance = this.getNewBalance();
    if (newBalance < 0) {
      return 'text-red-600';
    } else if (newBalance === 0) {
      return 'text-gray-600';
    } else {
      return 'text-green-600';
    }
  }
}
