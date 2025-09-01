import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { 
  LoadPatients, 
  CreatePatient, 
  UpdatePatient, 
  DeletePatient,
  LoadDoctors,
  LoadVisits,
  LoadFees,
  LoadActivityLogs
} from '../../store/actions';
import { PatientState, DoctorState, VisitState, FeeState, ActivityLogState } from '../../store/states';

@Component({
  selector: 'app-store-example',
  template: `
    <div class="container">
      <h2>NGXS Store Example</h2>
      
      <!-- Auth State -->
      <div class="section">
        <h3>Authentication State</h3>
        <p>Is Authenticated: {{ (isAuthenticated$ | async) ? 'Yes' : 'No' }}</p>
        <p>User Role: {{ (userRole$ | async) || 'None' }}</p>
        <p>Loading: {{ (authLoading$ | async) ? 'Yes' : 'No' }}</p>
        <p *ngIf="authError$ | async as error" class="error">Error: {{ error }}</p>
      </div>

      <!-- Patient State -->
      <div class="section">
        <h3>Patient State</h3>
        <button (click)="loadPatients()" [disabled]="patientLoading$ | async">
          {{ (patientLoading$ | async) ? 'Loading...' : 'Load Patients' }}
        </button>
        <p>Patient Count: {{ (patientCount$ | async) || 0 }}</p>
        <p>Loading: {{ (patientLoading$ | async) ? 'Yes' : 'No' }}</p>
        <p *ngIf="patientError$ | async as error" class="error">Error: {{ error }}</p>
        
        <div *ngIf="patients$ | async as patients">
          <h4>Patients:</h4>
          <ul>
            <li *ngFor="let patient of patients">
              {{ patient.firstName }} {{ patient.lastName }} (ID: {{ patient.patientId }})
            </li>
          </ul>
        </div>
      </div>

      <!-- Doctor State -->
      <div class="section">
        <h3>Doctor State</h3>
        <button (click)="loadDoctors()" [disabled]="doctorLoading$ | async">
          {{ (doctorLoading$ | async) ? 'Loading...' : 'Load Doctors' }}
        </button>
        <p>Doctor Count: {{ (doctorCount$ | async) || 0 }}</p>
        <p>Loading: {{ (doctorLoading$ | async) ? 'Yes' : 'No' }}</p>
        <p *ngIf="doctorError$ | async as error" class="error">Error: {{ error }}</p>
      </div>

      <!-- Visit State -->
      <div class="section">
        <h3>Visit State</h3>
        <button (click)="loadVisits()" [disabled]="visitLoading$ | async">
          {{ (visitLoading$ | async) ? 'Loading...' : 'Load Visits' }}
        </button>
        <p>Visit Count: {{ (visitCount$ | async) || 0 }}</p>
        <p>Loading: {{ (visitLoading$ | async) ? 'Yes' : 'No' }}</p>
        <p *ngIf="visitError$ | async as error" class="error">Error: {{ error }}</p>
      </div>

      <!-- Fee State -->
      <div class="section">
        <h3>Fee State</h3>
        <button (click)="loadFees()" [disabled]="feeLoading$ | async">
          {{ (feeLoading$ | async) ? 'Loading...' : 'Load Fees' }}
        </button>
        <p>Fee Count: {{ (feeCount$ | async) || 0 }}</p>
        <p>Loading: {{ (feeLoading$ | async) ? 'Yes' : 'No' }}</p>
        <p *ngIf="feeError$ | async as error" class="error">Error: {{ error }}</p>
      </div>

      <!-- Activity Log State -->
      <div class="section">
        <h3>Activity Log State</h3>
        <button (click)="loadActivityLogs()" [disabled]="activityLogLoading$ | async">
          {{ (activityLogLoading$ | async) ? 'Loading...' : 'Load Activity Logs' }}
        </button>
        <p>Activity Log Count: {{ (activityLogCount$ | async) || 0 }}</p>
        <p>Loading: {{ (activityLogLoading$ | async) ? 'Yes' : 'No' }}</p>
        <p *ngIf="activityLogError$ | async as error" class="error">Error: {{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .error {
      color: red;
      font-weight: bold;
    }
    button {
      padding: 10px 20px;
      margin: 5px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class StoreExampleComponent implements OnInit {
  // Auth State Selectors
  isAuthenticated$: Observable<boolean>;
  userRole$: Observable<string | null>;
  authLoading$: Observable<boolean>;
  authError$: Observable<string | null>;

  // Patient State Selectors
  patients$: Observable<any[]>;
  patientCount$: Observable<number>;
  patientLoading$: Observable<boolean>;
  patientError$: Observable<string | null>;

  // Doctor State Selectors
  doctorCount$: Observable<number>;
  doctorLoading$: Observable<boolean>;
  doctorError$: Observable<string | null>;

  // Visit State Selectors
  visitCount$: Observable<number>;
  visitLoading$: Observable<boolean>;
  visitError$: Observable<string | null>;

  // Fee State Selectors
  feeCount$: Observable<number>;
  feeLoading$: Observable<boolean>;
  feeError$: Observable<string | null>;

  // Activity Log State Selectors
  activityLogCount$: Observable<number>;
  activityLogLoading$: Observable<boolean>;
  activityLogError$: Observable<string | null>;

  constructor(private store: Store) {
    // Initialize selectors
    this.initializeSelectors();
  }

  ngOnInit(): void {
    // Load initial data
    this.loadPatients();
    this.loadDoctors();
    this.loadVisits();
    this.loadFees();
    this.loadActivityLogs();
  }

  private initializeSelectors(): void {
    // Auth State
    this.isAuthenticated$ = this.store.select(PatientState.isAuthenticated);
    this.userRole$ = this.store.select(PatientState.role);
    this.authLoading$ = this.store.select(PatientState.loading);
    this.authError$ = this.store.select(PatientState.error);

    // Patient State
    this.patients$ = this.store.select(PatientState.patients);
    this.patientCount$ = this.store.select(PatientState.patientsCount);
    this.patientLoading$ = this.store.select(PatientState.loading);
    this.patientError$ = this.store.select(PatientState.error);

    // Doctor State
    this.doctorCount$ = this.store.select(DoctorState.doctorsCount);
    this.doctorLoading$ = this.store.select(DoctorState.loading);
    this.doctorError$ = this.store.select(DoctorState.error);

    // Visit State
    this.visitCount$ = this.store.select(VisitState.visitsCount);
    this.visitLoading$ = this.store.select(VisitState.loading);
    this.visitError$ = this.store.select(VisitState.error);

    // Fee State
    this.feeCount$ = this.store.select(FeeState.feesCount);
    this.feeLoading$ = this.store.select(FeeState.loading);
    this.feeError$ = this.store.select(FeeState.error);

    // Activity Log State
    this.activityLogCount$ = this.store.select(ActivityLogState.activityLogsCount);
    this.activityLogLoading$ = this.store.select(ActivityLogState.loading);
    this.activityLogError$ = this.store.select(ActivityLogState.error);
  }

  // Action Dispatchers
  loadPatients(): void {
    this.store.dispatch(new LoadPatients());
  }

  loadDoctors(): void {
    this.store.dispatch(new LoadDoctors());
  }

  loadVisits(): void {
    this.store.dispatch(new LoadVisits());
  }

  loadFees(): void {
    this.store.dispatch(new LoadFees());
  }

  loadActivityLogs(): void {
    this.store.dispatch(new LoadActivityLogs());
  }
}
