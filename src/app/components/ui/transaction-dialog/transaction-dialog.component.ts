import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// NGX-CURRENCY
import { NgxCurrencyDirective } from 'ngx-currency';

// Models
import { Account } from '../../../models/account.model';

export interface TransactionDialogData {
  title: string;
  message: string;
  account?: Account;
  type?: 'deposit' | 'withdraw';
  accountNumber?: string;
}

export interface TransactionDialogResult {
  amount: number;
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
    MatProgressSpinnerModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './transaction-dialog.component.html',
})
export class TransactionDialogComponent implements OnInit {
  transactionForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData
  ) {
    // Set default type if not provided
    if (!this.data.type) {
      this.data.type = this.data.title?.toLowerCase().includes('deposit') ? 'deposit' : 'withdraw';
    }
  }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      amount: ['', [
        Validators.required, 
        Validators.min(0.01),
      ]],
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.loading = true;
      
      const result: TransactionDialogResult = {
        amount: this.transactionForm.value.amount,
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
}
