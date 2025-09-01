import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, ChangePasswordDto } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>User Profile</h2>

      @if (successMessage) {
        <div class="alert alert-success">
          {{ successMessage }}
        </div>
      }

      @if (errorMessage) {
        <div class="alert alert-danger">
          {{ errorMessage }}
        </div>
      }

      <div class="row">
        <div class="col-md-6">
          <h3>Profile Information</h3>
          <div class="form-group">
            <label>Username</label>
            <input type="text" [value]="currentUser?.username" class="form-control" readonly>
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input type="email" [value]="currentUser?.email" class="form-control" readonly>
          </div>
          
          <div class="form-group">
            <label>Role</label>
            <input type="text" [value]="currentUser?.role" class="form-control" readonly>
          </div>
        </div>

        <div class="col-md-6">
          <h3>Change Password</h3>
          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                formControlName="newPassword" 
                class="form-control">
              @if (passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched) {
                <div class="error-message">Password is required and must be at least 6 characters</div>
              }
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                formControlName="confirmPassword" 
                class="form-control">
              @if (passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched) {
                <div class="error-message">Please confirm your password</div>
              }
            </div>
            
            <button type="submit" class="btn btn-primary" [disabled]="isSubmitting || passwordForm.invalid">
              @if (isSubmitting) {
                Changing Password...
              } @else {
                Change Password
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  passwordForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    if (!this.currentUser) {
      this.errorMessage = 'User not found';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const changePasswordData: ChangePasswordDto = {
      userId: this.currentUser.userId,
      newPassword: this.passwordForm.value.newPassword
    };

    this.authService.changePassword(changePasswordData).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully';
        this.passwordForm.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to change password';
        this.isSubmitting = false;
      }
    });
  }
}

