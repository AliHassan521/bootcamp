import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      { path: 'patients', loadComponent: () => import('./components/patients/patients.component').then(m => m.PatientsComponent), canActivate: [RoleGuard], data: { roles: ['Receptionist', 'Admin'] } },
      { path: 'doctors', loadComponent: () => import('./components/doctors/doctors.component').then(m => m.DoctorsComponent), canActivate: [RoleGuard], data: { roles: ['Receptionist', 'Admin'] } },
      { path: 'visits', loadComponent: () => import('./components/visits/visits.component').then(m => m.VisitsComponent), canActivate: [RoleGuard], data: { roles: ['Doctor', 'Admin'] } },
      { path: 'fees', loadComponent: () => import('./components/fees/fees.component').then(m => m.FeesComponent), canActivate: [RoleGuard], data: { roles: ['Receptionist', 'Admin'] } },
      { path: 'activity-logs', loadComponent: () => import('./components/activity-logs/activity-logs.component').then(m => m.ActivityLogsComponent), canActivate: [RoleGuard], data: { roles: ['Admin'] } },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

