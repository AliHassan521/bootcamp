import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Register } from '../../store/actions/auth.actions';
import { AuthState } from '../../store/states/auth.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 50px auto;">
        <h2 class="text-center mb-3">Register</h2>
        
        @if (errorMessage()) {
          <div class="alert alert-danger">
            {{ errorMessage() }}
          </div>
        }
        
        @if (successMessage()) {
          <div class="alert alert-success">
            {{ successMessage() }}
          </div>
        }
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control">
            @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
              <div class="error-message">Username is required</div>
            }
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control">
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <div class="error-message">Valid email is required</div>
            }
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control">
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <div class="error-message">Password is required and must be at least 6 characters</div>
            }
          </div>
          
          <div class="form-group">
            <label for="role">Role</label>
            <select 
              id="role" 
              formControlName="role" 
              class="form-control">
              <option value="User">User</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%;" [disabled]="isLoading() || registerForm.invalid">
            @if (isLoading()) {
              Registering...
            } @else {
              Register
            }
          </button>
        </form>
        
        <div class="text-center mt-3">
         <p> Already have an account?<a routerLink="/login">Login here</a></p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User', Validators.required]
    });

    // Subscribe to store state changes
    this.store.select(AuthState.loading)
      .pipe(takeUntilDestroyed())
      .subscribe(loading => this.isLoading.set(loading));

    this.store.select(AuthState.error)
      .pipe(takeUntilDestroyed())
      .subscribe(error => {
        if (error) {
          this.errorMessage.set(error);
          this.successMessage.set('');
        }
      });

    // Handle successful registration
    this.store.select(AuthState.user)
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        if (user && user.username) {
          this.successMessage.set('Registration successful! Please login.');
          this.registerForm.reset();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage.set('');
      this.successMessage.set('');
      
      // Dispatch register action to store
      this.store.dispatch(new Register(this.registerForm.value));
    }
  }
}
