import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MaterialShowcaseComponent } from './components/material-showcase/material-showcase.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'showcase', component: MaterialShowcaseComponent },
  { path: '**', redirectTo: '' }
];
