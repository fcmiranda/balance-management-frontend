import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="welcome-card">
        <h2>Welcome to Balance Management System</h2>
        <p>This is a simple Angular v18 application with Jest testing configured.</p>
        
        <div class="features">
          <h3>Features:</h3>
          <ul>
            <li>Angular v18 with standalone components</li>
            <li>Jest testing framework</li>
            <li>TypeScript configuration</li>
            <li>SCSS styling</li>
            <li>Responsive design</li>
          </ul>
        </div>

        <div class="actions">
          <button class="btn" (click)="onGetStarted()">Get Started</button>
          <button class="btn btn-secondary" (click)="onLearnMore()">Learn More</button>
        </div>
      </div>

      <div class="info-cards">
        <div class="card">
          <h3>Quick Start</h3>
          <p>Run <code>npm start</code> to start the development server.</p>
        </div>
        
        <div class="card">
          <h3>Testing</h3>
          <p>Run <code>npm test</code> to execute the Jest test suite.</p>
        </div>
        
        <div class="card">
          <h3>Build</h3>
          <p>Run <code>npm run build</code> to build the project for production.</p>
        </div>
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
