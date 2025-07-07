import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MaterialShowcaseComponent } from './components/material-showcase/material-showcase.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AdminUserManagementComponent } from './components/admin/admin-user-management/admin-user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'showcase', component: MaterialShowcaseComponent },
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
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/users', 
    component: AdminUserManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '' }
];
