import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AdminUserManagementComponent } from './components/admin/admin-user-management/admin-user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'account/:id', 
    component: AccountDetailsComponent,
  },
  { 
    path: 'admin/users', 
    component: AdminUserManagementComponent,
  },
  { path: '**', redirectTo: 'login' }
];
