import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

// Services and Models
import { UserService } from '../../../services/user.service';
import { User, UserRole, RegisterRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  submitting = false;
  hidePassword = true;
  hideConfirmPassword = true;
  
  user: User | null = null;
  
  roles: UserRole[] = ['client', 'admin'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if we're in edit mode by looking for user ID in route params
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.isEditMode = true;
        this.loadUser();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['client', [Validators.required]],
      password: [''],
      confirmPassword: ['']
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  private updateFormValidators(): void {
    const passwordControl = this.userForm.get('password');
    const confirmPasswordControl = this.userForm.get('confirmPassword');

    if (this.isEditMode) {
      // In edit mode, password is optional
      passwordControl?.setValidators([Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([]);
    } else {
      // In create mode, password is required
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    }

    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  private loadUser(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.userService.getUser(this.userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        this.user = user;
        this.populateForm(user);
        this.updateFormValidators();
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Falha ao carregar usuário', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
        this.router.navigate(['/admin/users']);
      }
    });
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    // Only validate if both fields have values
    if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.submitting = true;
      
      if (this.isEditMode) {
        this.updateUser();
      } else {
        this.createUser();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createUser(): void {
    const { confirmPassword, ...formData } = this.userForm.value;
    const userData: RegisterRequest = formData;
    
    this.userService.createUser(userData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        this.snackBar.open('Usuário criado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Falha ao criar usuário', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.submitting = false;
      }
    });
  }

  private updateUser(): void {
    if (!this.userId) return;
    
    const formData = this.userForm.value;
    const updateData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      role: formData.role
    };

    // Only include password if it's provided
    if (formData.password) {
      (updateData as any).password = formData.password;
    }
    
    this.userService.updateUser(this.userId, updateData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Falha ao atualizar usuário', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.submitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  getRoleColor(role: UserRole): string {
    return role === 'admin' ? 'primary' : 'accent';
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Usuário' : 'Criar Novo Usuário';
  }

  get submitButtonText(): string {
    if (this.submitting) {
      return '';
    }
    return this.isEditMode ? 'Atualizar Usuário' : 'Criar Usuário';
  }
}
