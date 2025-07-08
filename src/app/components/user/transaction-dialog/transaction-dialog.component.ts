import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface TransactionDialogData {
  accountId: string;
  accountNumber: string;
  type: 'withdraw' | 'deposit';
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
    MatIconModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center mb-6">
        <mat-icon class="text-3xl mr-3" [class]="getIconClass()">{{ getIcon() }}</mat-icon>
        <div>
          <h2 class="text-xl font-semibold">{{ getTitle() }}</h2>
          <p class="text-gray-600">Account: {{ data.accountNumber }}</p>
          <p class="text-sm text-gray-500">Current Balance: {{ formatCurrency(data.currentBalance) }}</p>
        </div>
      </div>

      <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="w-full mb-4">
          <mat-label>Amount (R$)</mat-label>
          <input 
            matInput 
            type="text"
            formControlName="amount"
            placeholder="0,00"
            (input)="onAmountInput($event)"
            (blur)="formatAmountOnBlur()"
          >
          <mat-icon matSuffix>attach_money</mat-icon>
          <mat-error *ngIf="transactionForm.get('amount')?.hasError('required')">
            Amount is required
          </mat-error>
          <mat-error *ngIf="transactionForm.get('amount')?.hasError('min')">
            Minimum amount is R$ 0,01
          </mat-error>
          <mat-error *ngIf="transactionForm.get('amount')?.hasError('max')">
            Maximum amount is R$ 999.999,99
          </mat-error>
          <mat-error *ngIf="transactionForm.get('amount')?.hasError('insufficientFunds') && data.type === 'withdraw'">
            Insufficient funds
          </mat-error>
        </mat-form-field>

        <div class="flex gap-3 justify-end">
          <button 
            type="button" 
            mat-button 
            (click)="onCancel()"
            class="px-6"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            mat-raised-button 
            [color]="getButtonColor()"
            [disabled]="transactionForm.invalid"
            class="px-6"
          >
            <mat-icon class="mr-2">{{ getIcon() }}</mat-icon>
            {{ getActionText() }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .p-6 {
      padding: 1.5rem;
    }
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .mr-3 {
      margin-right: 0.75rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
    }
    .w-full {
      width: 100%;
    }
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .justify-end {
      justify-content: flex-end;
    }
    .gap-3 {
      gap: 0.75rem;
    }
    .px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .text-xl {
      font-size: 1.25rem;
    }
    .text-3xl {
      font-size: 1.875rem;
    }
    .text-sm {
      font-size: 0.875rem;
    }
    .font-semibold {
      font-weight: 600;
    }
    .text-gray-600 {
      color: #4B5563;
    }
    .text-gray-500 {
      color: #6B7280;
    }
    .text-green-600 {
      color: #059669;
    }
    .text-red-600 {
      color: #DC2626;
    }
  `]
})
export class TransactionDialogComponent {
  transactionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData
  ) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required]]
    });
  }

  onAmountInput(event: any): void {
    let value = event.target.value;
    
    // Remove all non-numeric characters except comma
    value = value.replace(/[^\d,]/g, '');
    
    // Ensure only one comma
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places after comma
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + ',' + parts[1].substring(0, 2);
    }
    
    // Add thousands separator
    if (parts[0].length > 3) {
      parts[0] = this.addThousandsSeparator(parts[0]);
      value = parts.join(',');
    }
    
    event.target.value = value;
    this.validateAmount(value);
  }

  formatAmountOnBlur(): void {
    const control = this.transactionForm.get('amount');
    if (control?.value) {
      const numericValue = this.parseAmount(control.value);
      control.setValue(this.formatBrazilianCurrency(numericValue));
      this.validateAmount(control.value);
    }
  }

  private addThousandsSeparator(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private parseAmount(value: string): number {
    // Remove thousands separators and replace comma with dot
    const cleaned = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }

  private formatBrazilianCurrency(amount: number): string {
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private validateAmount(value: string): void {
    const numericValue = this.parseAmount(value);
    const control = this.transactionForm.get('amount');
    
    if (!control) return;

    // Clear previous custom errors
    const errors = { ...control.errors };
    delete errors['min'];
    delete errors['max'];
    delete errors['insufficientFunds'];
    
    // Check minimum amount
    if (numericValue < 0.01) {
      errors['min'] = true;
    }
    
    // Check maximum amount
    if (numericValue > 999999.99) {
      errors['max'] = true;
    }
    
    // Check insufficient funds for withdrawals
    if (this.data.type === 'withdraw' && numericValue > this.data.currentBalance) {
      errors['insufficientFunds'] = true;
    }
    
    control.setErrors(Object.keys(errors).length ? errors : null);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  getTitle(): string {
    return this.data.type === 'withdraw' ? 'Withdraw Funds' : 'Deposit Funds';
  }

  getIcon(): string {
    return this.data.type === 'withdraw' ? 'remove_circle_outline' : 'add_circle_outline';
  }

  getIconClass(): string {
    return this.data.type === 'withdraw' ? 'text-red-600' : 'text-green-600';
  }

  getButtonColor(): string {
    return this.data.type === 'withdraw' ? 'warn' : 'primary';
  }

  getActionText(): string {
    return this.data.type === 'withdraw' ? 'Withdraw' : 'Deposit';
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const amount = this.parseAmount(this.transactionForm.get('amount')?.value);
      this.dialogRef.close({
        type: this.data.type,
        amount: amount,
        accountId: this.data.accountId
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
