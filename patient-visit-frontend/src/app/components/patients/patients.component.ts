import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Patient, CreatePatientDto, UpdatePatientDto } from '../../models/patient.model';
import { 
  LoadPatients, 
  CreatePatient, 
  UpdatePatient, 
  DeletePatient,
  ClearPatientError 
} from '../../store/actions/patient.actions';
import { PatientState } from '../../store/states/patient.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Patients Management</h2>
        <button class="btn btn-primary" (click)="showAddForm()">Add New Patient</button>
      </div>

      @if (successMessage()) {
        <div class="alert alert-success">
          {{ successMessage() }}
        </div>
      }

      @if (errorMessage()) {
        <div class="alert alert-danger">
          {{ errorMessage() }}
        </div>
      }

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading patients...</p>
        </div>
      }

      @if (!isLoading() && patients().length === 0) {
        <div class="text-center">
          <p>No patients found.</p>
        </div>
      }

      @if (!isLoading() && patients().length > 0) {
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (patient of patients(); track patient.patientId) {
              <tr>
                <td>{{ patient.patientId }}</td>
                <td>{{ patient.firstName }} {{ patient.lastName }}</td>
                <td>{{ patient.dateOfBirth | date:'shortDate' }}</td>
                <td>{{ patient.gender }}</td>
                <td>{{ patient.phone }}</td>
                <td>{{ patient.email }}</td>
                <td>
                  <button class="btn btn-warning btn-sm" (click)="editPatient(patient)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deletePatient(patient.patientId)">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }

      <!-- Add/Edit Modal -->
      @if (showModal()) {
        <div class="modal show">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">
                @if (isEditing()) {
                  Edit Patient
                } @else {
                  Add New Patient
                }
              </h3>
              <span class="close" (click)="closeModal()">&times;</span>
            </div>
            
            <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" formControlName="firstName" class="form-control">
                @if (patientForm.get('firstName')?.invalid && patientForm.get('firstName')?.touched) {
                  <div class="error-message">First name is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" formControlName="lastName" class="form-control">
                @if (patientForm.get('lastName')?.invalid && patientForm.get('lastName')?.touched) {
                  <div class="error-message">Last name is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" formControlName="dateOfBirth" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" formControlName="gender" class="form-control">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" formControlName="phone" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" formControlName="email" class="form-control">
              </div>
              
              <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" formControlName="address" class="form-control" rows="3"></textarea>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSubmitting() || patientForm.invalid">
                  @if (isSubmitting()) {
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
export class PatientsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  // Signals for reactive state
  patients = signal<Patient[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  patientForm: FormGroup;
  editingPatientId: number | null = null;

  constructor() {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: [''],
      gender: [''],
      phone: [''],
      email: [''],
      address: ['']
    });

    // Subscribe to store state changes
    this.store.select(PatientState.patients)
      .pipe(takeUntilDestroyed())
      .subscribe(patients => this.patients.set(patients));

    this.store.select(PatientState.loading)
      .pipe(takeUntilDestroyed())
      .subscribe(loading => this.isLoading.set(loading));

    this.store.select(PatientState.error)
      .pipe(takeUntilDestroyed())
      .subscribe(error => {
        if (error) {
          this.errorMessage.set(error);
          this.successMessage.set('');
        }
      });

    // Handle success messages
    effect(() => {
      const currentPatients = this.patients();
      const wasLoading = this.isLoading();
      
      // Show success message when patients are loaded
      if (currentPatients.length > 0 && !wasLoading) {
        this.successMessage.set('Patients loaded successfully');
        setTimeout(() => this.successMessage.set(''), 3000);
      }
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    // Dispatch action to load patients
    this.store.dispatch(new LoadPatients());
  }

  showAddForm(): void {
    this.isEditing.set(false);
    this.editingPatientId = null;
    this.resetForm();
    this.showModal.set(true);
  }

  editPatient(patient: Patient): void {
    this.isEditing.set(true);
    this.editingPatientId = patient.patientId;
    this.patientForm.patchValue({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
    this.store.dispatch(new ClearPatientError());
  }

  resetForm(): void {
    this.patientForm.reset();
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValue = this.patientForm.value;

    if (this.isEditing() && this.editingPatientId) {
      const updateData: UpdatePatientDto = {
        ...formValue,
        patientId: this.editingPatientId
      };

      // Dispatch update action
      this.store.dispatch(new UpdatePatient({ id: this.editingPatientId, data: updateData }))
        .subscribe(() => {
          this.successMessage.set('Patient updated successfully');
          this.closeModal();
          this.isSubmitting.set(false);
          setTimeout(() => this.successMessage.set(''), 3000);
        });
    } else {
      const createData: CreatePatientDto = { ...formValue };

      // Dispatch create action
      this.store.dispatch(new CreatePatient(createData))
        .subscribe(() => {
          this.successMessage.set('Patient created successfully');
          this.closeModal();
          this.isSubmitting.set(false);
          setTimeout(() => this.successMessage.set(''), 3000);
        });
    }
  }

  deletePatient(patientId: number): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      // Dispatch delete action
      this.store.dispatch(new DeletePatient({ id: patientId }))
        .subscribe(() => {
          this.successMessage.set('Patient deleted successfully');
          setTimeout(() => this.successMessage.set(''), 3000);
        });
    }
  }
}
