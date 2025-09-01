import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { User } from '../../models/user.model';
import { Logout } from '../../store/actions/auth.actions';
import { AuthState } from '../../store/states/auth.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container d-flex justify-content-between align-items-center">
        <a class="navbar-brand" href="#">Patient Visit Manager</a>
        <ul class="navbar-nav d-flex align-items-center">
          <li><a routerLink="/dashboard/patients" routerLinkActive="active">Patients</a></li>
          <li><a routerLink="/dashboard/doctors" routerLinkActive="active">Doctors</a></li>
          <li><a routerLink="/dashboard/visits" routerLinkActive="active">Visits</a></li>
          <li><a routerLink="/dashboard/fees" routerLinkActive="active">Fees</a></li>
          @if (currentUser()?.role === 'Admin') {
            <li><a routerLink="/dashboard/activity-logs" routerLinkActive="active">Activity Logs</a></li>
          }
          <li><a routerLink="/dashboard/profile" routerLinkActive="active">Profile</a></li>
          <li><button class="btn btn-warning" (click)="logout()">Logout</button></li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <div class="card">
        <h2>Welcome, {{ currentUser()?.username }}!</h2>
        <p>Role: {{ currentUser()?.role }}</p>
      </div>
      
      <router-outlet></router-outlet>
    </div>
  `
})
export class DashboardComponent {
  private store = inject(Store);
  private router = inject(Router);

  // Signals for reactive state
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor() {
    // Subscribe to store state changes
    this.store.select(AuthState.user)
      .pipe(takeUntilDestroyed())
      .subscribe(user => this.currentUser.set(user));

    this.store.select(AuthState.isAuthenticated)
      .pipe(takeUntilDestroyed())
      .subscribe(isAuthenticated => {
        this.isAuthenticated.set(isAuthenticated);
        
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      });
  }

  logout(): void {
    // Dispatch logout action to store
    this.store.dispatch(new Logout());
    // The auth guard will handle redirecting to login
  }
}
