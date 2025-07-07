import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services
import { AccountService } from '../../services/account.service';

export interface TransactionDialogData {
  type: 'deposit' | 'withdraw';
  accountId: number;
  accountNumber: string;
  currentBalance: number;
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  transactionForm: FormGroup;
  loading = false;
  
  constructor(
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData,
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
    this.transactionForm = this.fb.group({
      amount: [
        '', 
        [
          Validators.required, 
          Validators.min(0.01),
          ...(data.type === 'withdraw' ? [Validators.max(data.currentBalance)] : [])
        ]
      ],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get title(): string {
    return this.data.type === 'deposit' ? 'Make Deposit' : 'Make Withdrawal';
  }

  get icon(): string {
    return this.data.type === 'deposit' ? 'add_circle' : 'remove_circle';
  }

  get buttonText(): string {
    return this.data.type === 'deposit' ? 'Deposit' : 'Withdraw';
  }

  get buttonColor(): string {
    return this.data.type === 'deposit' ? 'primary' : 'accent';
  }

  get maxAmount(): number {
    return this.data.type === 'withdraw' ? this.data.currentBalance : Number.MAX_VALUE;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.transactionForm.valid && !this.loading) {
      this.loading = true;
      
      const amount = Number(this.transactionForm.value.amount);
      const description = this.transactionForm.value.description || '';
      
      const transaction$ = this.data.type === 'deposit'
        ? this.accountService.deposit(this.data.accountId, amount, description)
        : this.accountService.withdraw(this.data.accountId, amount, description);
      
      transaction$.pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result) => {
          this.loading = false;
          this.snackBar.open(
            `${this.data.type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`,
            'Close',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.loading = false;
          const message = error.error?.message || 
                         `Failed to process ${this.data.type}. Please try again.`;
          this.snackBar.open(message, 'Close', {
            duration: 5000,
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

  getAmountError(): string {
    const amountControl = this.transactionForm.get('amount');
    if (amountControl?.hasError('required')) {
      return 'Amount is required';
    }
    if (amountControl?.hasError('min')) {
      return 'Amount must be greater than $0.00';
    }
    if (amountControl?.hasError('max')) {
      return `Amount cannot exceed ${this.formatCurrency(this.maxAmount)}`;
    }
    return '';
  }
}
