import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-header">
        <span>{{ title }}</span>
        <span class="spacer"></span>
        <nav class="nav-buttons">
          <a mat-button routerLink="/" class="nav-link">
            <mat-icon>home</mat-icon>
            Home
          </a>
          <a mat-button routerLink="/showcase" class="nav-link">
            <mat-icon>palette</mat-icon>
            Showcase
          </a>
        </nav>
      </mat-toolbar>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <mat-toolbar color="accent">
          <span class="footer-text">&copy; 2025 Balance Management System</span>
        </mat-toolbar>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Balance Management Frontend';
}
