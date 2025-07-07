import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-material-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
  ],
  template: `
    <div class="showcase-container">
      <mat-card class="showcase-header">
        <mat-card-header>
          <mat-card-title>Angular Material Showcase</mat-card-title>
          <mat-card-subtitle>Explore the power of Material Design components</mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <mat-tab-group class="showcase-tabs">
        <mat-tab label="Forms">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Form Controls</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="sampleForm" class="form-container">
                  <mat-form-field appearance="outline">
                    <mat-label>Full Name</mat-label>
                    <input matInput formControlName="fullName" placeholder="Enter your full name">
                    <mat-icon matSuffix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" placeholder="Enter your email">
                    <mat-icon matSuffix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Country</mat-label>
                    <mat-select formControlName="country">
                      <mat-option value="us">United States</mat-option>
                      <mat-option value="br">Brazil</mat-option>
                      <mat-option value="ca">Canada</mat-option>
                      <mat-option value="mx">Mexico</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Birth Date</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="birthDate">
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>

                  <div class="checkbox-group">
                    <mat-checkbox formControlName="newsletter">Subscribe to newsletter</mat-checkbox>
                    <mat-slide-toggle formControlName="notifications">Enable notifications</mat-slide-toggle>
                  </div>

                  <mat-radio-group formControlName="accountType" class="radio-group">
                    <mat-radio-button value="personal">Personal</mat-radio-button>
                    <mat-radio-button value="business">Business</mat-radio-button>
                  </mat-radio-group>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" (click)="onSubmit()">
                      <mat-icon>save</mat-icon>
                      Save
                    </button>
                    <button mat-stroked-button type="button" (click)="onReset()">
                      <mat-icon>refresh</mat-icon>
                      Reset
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Buttons & Actions">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Button Variants</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="button-section">
                  <h3>Raised Buttons</h3>
                  <div class="button-group">
                    <button mat-raised-button>Basic</button>
                    <button mat-raised-button color="primary">Primary</button>
                    <button mat-raised-button color="accent">Accent</button>
                    <button mat-raised-button color="warn">Warn</button>
                    <button mat-raised-button disabled>Disabled</button>
                  </div>
                </div>

                <div class="button-section">
                  <h3>Flat Buttons</h3>
                  <div class="button-group">
                    <button mat-flat-button>Basic</button>
                    <button mat-flat-button color="primary">Primary</button>
                    <button mat-flat-button color="accent">Accent</button>
                    <button mat-flat-button color="warn">Warn</button>
                  </div>
                </div>

                <div class="button-section">
                  <h3>Icon Buttons</h3>
                  <div class="button-group">
                    <button mat-icon-button>
                      <mat-icon>favorite</mat-icon>
                    </button>
                    <button mat-icon-button color="primary">
                      <mat-icon>bookmark</mat-icon>
                    </button>
                    <button mat-icon-button color="accent">
                      <mat-icon>share</mat-icon>
                    </button>
                    <button mat-icon-button (click)="showSnackbar()">
                      <mat-icon>notifications</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="button-section">
                  <h3>FAB Buttons</h3>
                  <div class="button-group">
                    <button mat-fab>
                      <mat-icon>add</mat-icon>
                    </button>
                    <button mat-fab color="primary">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-mini-fab color="accent">
                      <mat-icon>menu</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Progress & Loading">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Progress Indicators</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="progress-section">
                  <h3>Progress Spinners</h3>
                  <div class="progress-group">
                    <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
                    <mat-progress-spinner mode="determinate" value="40"></mat-progress-spinner>
                  </div>
                </div>

                <div class="progress-section">
                  <h3>Progress Bars</h3>
                  <div class="progress-bars">
                    <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                    <mat-progress-bar mode="determinate" value="60"></mat-progress-bar>
                    <mat-progress-bar mode="buffer" value="60" bufferValue="80"></mat-progress-bar>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Expansion Panel">
          <div class="tab-content">
            <mat-accordion>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>info</mat-icon>
                    Personal Information
                  </mat-panel-title>
                  <mat-panel-description>
                    Your personal details and preferences
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <p>This is where you can manage your personal information including name, email, and other details.</p>
              </mat-expansion-panel>

              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>security</mat-icon>
                    Security Settings
                  </mat-panel-title>
                  <mat-panel-description>
                    Password and security preferences
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <p>Configure your password, two-factor authentication, and other security settings here.</p>
              </mat-expansion-panel>

              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>notifications</mat-icon>
                    Notifications
                  </mat-panel-title>
                  <mat-panel-description>
                    Manage your notification preferences
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <p>Choose which notifications you'd like to receive and how you'd like to receive them.</p>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styleUrls: ['./material-showcase.component.scss']
})
export class MaterialShowcaseComponent {
  sampleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.sampleForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      birthDate: [''],
      newsletter: [false],
      notifications: [true],
      accountType: ['personal']
    });
  }

  onSubmit(): void {
    if (this.sampleForm.valid) {
      console.log('Form submitted:', this.sampleForm.value);
      this.showSnackbar('Form submitted successfully!');
    } else {
      this.showSnackbar('Please fill in all required fields');
    }
  }

  onReset(): void {
    this.sampleForm.reset();
    this.showSnackbar('Form reset');
  }

  showSnackbar(message: string = 'Action completed!'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
