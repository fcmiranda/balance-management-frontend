import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services and Models
import { AccountService } from '../../services/account.service';
import { AccountType, CreateAccountRequest } from '../../models/account.model';

@Component({
  selector: 'app-create-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-account-dialog.component.html',
  styleUrls: ['./create-account-dialog.component.scss']
})
export class CreateAccountDialogComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  accountForm: FormGroup;
  loading = false;
  
  accountTypes: { value: AccountType; label: string; description: string }[] = [
    {
      value: 'checking',
      label: 'Checking Account',
      description: 'For everyday transactions and bill payments'
    },
    {
      value: 'savings',
      label: 'Savings Account',
      description: 'For saving money and earning interest'
    },
    {
      value: 'business',
      label: 'Business Account',
      description: 'For business transactions and commercial use'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateAccountDialogComponent>,
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      type: ['', Validators.required],
      initialDeposit: [0, [Validators.min(0)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.accountForm.valid && !this.loading) {
      this.loading = true;
      
      const formData = this.accountForm.value;
      
      const accountData: CreateAccountRequest = {
        type: formData.type,
        initialDeposit: formData.initialDeposit || 0,
        description: formData.description || ''
      };
      
      this.accountService.createAccount(accountData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (account) => {
          this.loading = false;
          this.snackBar.open('Account created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(account);
        },
        error: (error) => {
          this.loading = false;
          const message = error.error?.message || 'Failed to create account. Please try again.';
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

  getSelectedAccountType() {
    const selectedType = this.accountForm.get('type')?.value;
    return this.accountTypes.find(type => type.value === selectedType);
  }
}
