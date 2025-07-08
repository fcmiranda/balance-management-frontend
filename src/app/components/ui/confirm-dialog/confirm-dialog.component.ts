import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  dialogType?: 'default' | 'warning' | 'danger';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center mb-6">
        <div>
          <h2 class="text-xl font-semibold">{{ data.title }}</h2>
          <p class="text-gray-600">{{ data.message }}</p>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button 
          type="button" 
          mat-button 
          (click)="onCancel()"
          class="px-6"
        >
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          type="button" 
          mat-raised-button 
          [color]="getButtonColor()"
          (click)="onConfirm()"
          class="px-6"
        >
          <mat-icon class="mr-2">{{ getConfirmIcon() }}</mat-icon>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .p-6 {
      padding: 1.5rem;
    }
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    .mr-3 {
      margin-right: 0.75rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
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
    .font-semibold {
      font-weight: 600;
    }
    .text-gray-600 {
      color: #4B5563;
    }
    .text-red-600 {
      color: #DC2626;
    }
    .text-orange-600 {
      color: #EA580C;
    }
    .text-blue-600 {
      color: #2563EB;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getButtonColor(): string {
    switch (this.data.dialogType) {
      case 'warning':
        return 'accent';
      case 'danger':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getConfirmIcon(): string {
    switch (this.data.dialogType) {
      case 'danger':
        return 'delete';
      default:
        return 'check';
    }
  }
}
