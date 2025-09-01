import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, CreateDoctorDto, UpdateDoctorDto } from '../../models/doctor.model';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Doctors Management</h2>
        <button class="btn btn-primary" (click)="showAddForm()">Add New Doctor</button>
      </div>

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

      @if (isLoading) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading doctors...</p>
        </div>
      }

      @if (!isLoading && doctors.length === 0) {
        <div class="text-center">
          <p>No doctors found.</p>
        </div>
      }

      @if (!isLoading && doctors.length > 0) {
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialty</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (doctor of doctors; track doctor.doctorId) {
              <tr>
                <td>{{ doctor.doctorId }}</td>
                <td>{{ doctor.firstName }} {{ doctor.lastName }}</td>
                <td>{{ doctor.specialty }}</td>
                <td>{{ doctor.phone }}</td>
                <td>{{ doctor.email }}</td>
                <td>
                  <button class="btn btn-warning btn-sm" (click)="editDoctor(doctor)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteDoctor(doctor.doctorId)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }

      <!-- Add/Edit Modal -->
      @if (showModal) {
        <div class="modal show">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">
                @if (isEditing) {
                  Edit Doctor
                } @else {
                  Add New Doctor
                }
              </h3>
              <span class="close" (click)="closeModal()">&times;</span>
            </div>
            
            <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" formControlName="firstName" class="form-control">
                @if (doctorForm.get('firstName')?.invalid && doctorForm.get('firstName')?.touched) {
                  <div class="error-message">First name is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" formControlName="lastName" class="form-control">
                @if (doctorForm.get('lastName')?.invalid && doctorForm.get('lastName')?.touched) {
                  <div class="error-message">Last name is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="specialty">Specialty</label>
                <input type="text" id="specialty" formControlName="specialty" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" formControlName="phone" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" formControlName="email" class="form-control">
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSubmitting || doctorForm.invalid">
                  @if (isSubmitting) {
                    Saving...
                  } @else {
                    Save
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  isLoading = false;
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  doctorForm: FormGroup;
  editingDoctorId: number | null = null;

  constructor(
    private doctorService: DoctorService,
    private fb: FormBuilder
  ) {
    this.doctorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      specialty: [''],
      phone: [''],
      email: ['']
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load doctors';
        this.isLoading = false;
      }
    });
  }

  showAddForm(): void {
    this.isEditing = false;
    this.editingDoctorId = null;
    this.resetForm();
    this.showModal = true;
  }

  editDoctor(doctor: Doctor): void {
    this.isEditing = true;
    this.editingDoctorId = doctor.doctorId;
    this.doctorForm.patchValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.doctorForm.reset();
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.doctorForm.value;

    if (this.isEditing && this.editingDoctorId) {
      const updateData: UpdateDoctorDto = {
        ...formValue,
        doctorId: this.editingDoctorId
      };

      this.doctorService.updateDoctor(this.editingDoctorId, updateData).subscribe({
        next: () => {
          this.successMessage = 'Doctor updated successfully';
          this.closeModal();
          this.loadDoctors();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update doctor';
          this.isSubmitting = false;
        }
      });
    } else {
      const createData: CreateDoctorDto = { ...formValue };

      this.doctorService.createDoctor(createData).subscribe({
        next: () => {
          this.successMessage = 'Doctor created successfully';
          this.closeModal();
          this.loadDoctors();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to create doctor';
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteDoctor(doctorId: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(doctorId).subscribe({
        next: () => {
          this.successMessage = 'Doctor deleted successfully';
          this.loadDoctors();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete doctor';
        }
      });
    }
  }
}
