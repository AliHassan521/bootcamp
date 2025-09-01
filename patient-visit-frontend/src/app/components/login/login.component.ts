import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../store/actions/auth.actions';
import { AuthState } from '../../store/states/auth.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login</h2>
        
        @if (errorMessage()) {
          <div class="alert alert-error">
            {{ errorMessage() }}
          </div>
        }
        
        @if (isLoading()) {
          <div class="loading">Loading...</div>
        } @else {
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                formControlName="username"
                [class.error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              />
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <div class="error-message">Username is required</div>
              }
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <div class="error-message">Password is required</div>
              }
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="btn btn-primary">
              Login
            </button>
          </form>
        }

        <div class="login-footer">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-card h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-group input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }

    .login-footer a {
      color: #007bff;
      text-decoration: none;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Subscribe to store state changes
    this.store.select(AuthState.loading)
      .pipe(takeUntilDestroyed())
      .subscribe(loading => this.isLoading.set(loading));

    this.store.select(AuthState.error)
      .pipe(takeUntilDestroyed())
      .subscribe(error => this.errorMessage.set(error || ''));

    // Navigate to dashboard on successful login
    this.store.select(AuthState.isAuthenticated)
      .pipe(takeUntilDestroyed())
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage.set('');
      
      // Dispatch login action to store
      this.store.dispatch(new Login(this.loginForm.value));
    }
  }
}
