import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Visit, CreateVisitDto, UpdateVisitDto } from '../../models/visit.model';
import { Patient } from '../../models/patient.model';
import { Doctor } from '../../models/doctor.model';
import { 
  LoadVisits, 
  CreateVisit, 
  UpdateVisit, 
  DeleteVisit,
  ClearVisitError 
} from '../../store/actions/visit.actions';
import { 
  LoadPatients 
} from '../../store/actions/patient.actions';
import { 
  LoadDoctors 
} from '../../store/actions/doctor.actions';
import { VisitState } from '../../store/states/visit.state';
import { PatientState } from '../../store/states/patient.state';
import { DoctorState } from '../../store/states/doctor.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Visits Management</h2>
        <button class="btn btn-primary" (click)="showAddForm()">Add New Visit</button>
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
          <p>Loading visits...</p>
        </div>
      }

      @if (!isLoading() && visits().length === 0) {
        <div class="text-center">
          <p>No visits found.</p>
        </div>
      }

      @if (!isLoading() && visits().length > 0) {
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Visit Date</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (visit of visits(); track visit.visitId) {
              <tr>
                <td>{{ visit.visitId }}</td>
                <td>{{ getPatientName(visit.patientId) }}</td>
                <td>{{ getDoctorName(visit.doctorId) }}</td>
                <td>{{ visit.visitDate | date:'short' }}</td>
                <td>{{ visit.status }}</td>
                <td>{{ visit.notes }}</td>
                <td>
                  <button class="btn btn-warning btn-sm" (click)="editVisit(visit)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteVisit(visit.visitId)">Delete</button>
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
                  Edit Visit
                } @else {
                  Add New Visit
                }
              </h3>
              <span class="close" (click)="closeModal()">&times;</span>
            </div>
            
            <form [formGroup]="visitForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="patientId">Patient</label>
                <select id="patientId" formControlName="patientId" class="form-control">
                  <option value="">Select Patient</option>
                  @for (patient of patients(); track patient.patientId) {
                    <option [value]="patient.patientId">
                      {{ patient.firstName }} {{ patient.lastName }}
                    </option>
                  }
                </select>
                @if (visitForm.get('patientId')?.invalid && visitForm.get('patientId')?.touched) {
                  <div class="error-message">Patient is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="doctorId">Doctor</label>
                <select id="doctorId" formControlName="doctorId" class="form-control">
                  <option value="">Select Doctor</option>
                  @for (doctor of doctors(); track doctor.doctorId) {
                    <option [value]="doctor.doctorId">
                      {{ doctor.firstName }} {{ doctor.lastName }} - {{ doctor.specialty }}
                    </option>
                  }
                </select>
                @if (visitForm.get('doctorId')?.invalid && visitForm.get('doctorId')?.touched) {
                  <div class="error-message">Doctor is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="visitDate">Visit Date</label>
                <input type="datetime-local" id="visitDate" formControlName="visitDate" class="form-control">
                @if (visitForm.get('visitDate')?.invalid && visitForm.get('visitDate')?.touched) {
                  <div class="error-message">Visit date is required</div>
                }
              </div>
              
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" formControlName="status" class="form-control">
                  <option value="">Select Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="notes">Notes</label>
                <textarea id="notes" formControlName="notes" class="form-control" rows="3"></textarea>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSubmitting() || visitForm.invalid">
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
export class VisitsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  // Signals for reactive state
  visits = signal<Visit[]>([]);
  patients = signal<Patient[]>([]);
  doctors = signal<Doctor[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  visitForm: FormGroup;
  editingVisitId: number | null = null;

  constructor() {
    this.visitForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      visitDate: ['', Validators.required],
      status: [''],
      notes: ['']
    });

    // Subscribe to store state changes
    this.store.select(VisitState.visits)
      .pipe(takeUntilDestroyed())
      .subscribe((visits: Visit[]) => this.visits.set(visits));

    this.store.select(VisitState.loading)
      .pipe(takeUntilDestroyed())
      .subscribe((loading: boolean) => this.isLoading.set(loading));

    this.store.select(VisitState.error)
      .pipe(takeUntilDestroyed())
      .subscribe((error: string | null) => {
        if (error) {
          this.errorMessage.set(error);
          this.successMessage.set('');
        }
      });

    this.store.select(PatientState.patients)
      .pipe(takeUntilDestroyed())
      .subscribe((patients: Patient[]) => this.patients.set(patients));

    this.store.select(DoctorState.doctors)
      .pipe(takeUntilDestroyed())
      .subscribe((doctors: Doctor[]) => this.doctors.set(doctors));

    // Handle success messages
    effect(() => {
      const currentVisits = this.visits();
      const wasLoading = this.isLoading();
      
      // Show success message when visits are loaded
      if (currentVisits.length > 0 && !wasLoading) {
        this.successMessage.set('Visits loaded successfully');
        setTimeout(() => this.successMessage.set(''), 3000);
      }
    });
  }

  ngOnInit(): void {
    this.loadVisits();
    this.loadPatients();
    this.loadDoctors();
  }

  loadVisits(): void {
    // Dispatch action to load visits
    this.store.dispatch(new LoadVisits());
  }

  loadPatients(): void {
    // Dispatch action to load patients
    this.store.dispatch(new LoadPatients());
  }

  loadDoctors(): void {
    // Dispatch action to load doctors
    this.store.dispatch(new LoadDoctors());
  }

  getPatientName(patientId: number): string {
    const patient = this.patients().find(p => p.patientId === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors().find(d => d.doctorId === doctorId);
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  }

  showAddForm(): void {
    this.isEditing.set(false);
    this.editingVisitId = null;
    this.resetForm();
    this.showModal.set(true);
  }

  editVisit(visit: Visit): void {
    this.isEditing.set(true);
    this.editingVisitId = visit.visitId;
    this.visitForm.patchValue({
      patientId: visit.patientId,
      doctorId: visit.doctorId,
      visitDate: visit.visitDate,
      status: visit.status,
      notes: visit.notes
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
    this.store.dispatch(new ClearVisitError());
  }

  resetForm(): void {
    this.visitForm.reset();
  }

  onSubmit(): void {
    if (this.visitForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValue = this.visitForm.value;

    if (this.isEditing() && this.editingVisitId) {
      const updateData: UpdateVisitDto = {
        ...formValue,
        visitId: this.editingVisitId
      };

      // Dispatch update action
      this.store.dispatch(new UpdateVisit({ id: this.editingVisitId, data: updateData }))
        .subscribe(() => {
          this.successMessage.set('Visit updated successfully');
          this.closeModal();
          this.isSubmitting.set(false);
          setTimeout(() => this.successMessage.set(''), 3000);
        });
    } else {
      const createData: CreateVisitDto = { ...formValue };

      // Dispatch create action
      this.store.dispatch(new CreateVisit(createData))
        .subscribe(() => {
          this.successMessage.set('Visit created successfully');
          this.closeModal();
          this.isSubmitting.set(false);
          setTimeout(() => this.successMessage.set(''), 3000);
        });
    }
  }

  deleteVisit(visitId: number): void {
    if (confirm('Are you sure you want to delete this visit?')) {
      // Dispatch delete action
      this.store.dispatch(new DeleteVisit({ id: visitId }))
        .subscribe(() => {
          this.successMessage.set('Visit deleted successfully');
          setTimeout(() => this.successMessage.set(''), 3000);
        });
    }
  }
}
