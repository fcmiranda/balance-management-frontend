import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="home-container">
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-card-title>Welcome to Balance Management System</mat-card-title>
          <mat-card-subtitle>Angular v18 application with Material Design</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <p>This is a modern Angular application featuring Material Design components and comprehensive testing.</p>
          
          <div class="features-section">
            <h3>Features:</h3>
            <div class="feature-chips">
              <mat-chip-set>
                <mat-chip selected>Angular v18</mat-chip>
                <mat-chip>Material Design</mat-chip>
                <mat-chip>Jest Testing</mat-chip>
                <mat-chip>TypeScript</mat-chip>
                <mat-chip>Responsive Design</mat-chip>
                <mat-chip>Standalone Components</mat-chip>
              </mat-chip-set>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="actions-section">
            <button mat-raised-button color="primary" (click)="onGetStarted()">
              <mat-icon>rocket_launch</mat-icon>
              Get Started
            </button>
            <button mat-stroked-button color="accent" (click)="onLearnMore()">
              <mat-icon>info</mat-icon>
              Learn More
            </button>
            <a mat-flat-button color="accent" routerLink="/showcase">
              <mat-icon>palette</mat-icon>
              Material Showcase
            </a>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="info-cards">
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>play_arrow</mat-icon>
              Quick Start
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Run <code>npm start</code> to start the development server.</p>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>science</mat-icon>
              Testing
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Run <code>npm test</code> to execute the Jest test suite.</p>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>build</mat-icon>
              Build
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Run <code>npm run build</code> to build the project for production.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  onGetStarted(): void {
    console.log('Get Started clicked!');
    // Add your navigation logic here
  }

  onLearnMore(): void {
    console.log('Learn More clicked!');
    // Add your learn more logic here
  }
}
