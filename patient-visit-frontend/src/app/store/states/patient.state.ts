import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import {
  LoadPatients,
  LoadPatientsSuccess,
  LoadPatientsFailure,
  LoadPatient,
  LoadPatientSuccess,
  LoadPatientFailure,
  CreatePatient,
  CreatePatientSuccess,
  CreatePatientFailure,
  UpdatePatient,
  UpdatePatientSuccess,
  UpdatePatientFailure,
  DeletePatient,
  DeletePatientSuccess,
  DeletePatientFailure,
  ClearPatientError
} from '../actions/patient.actions';

export interface PatientStateModel {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

@State<PatientStateModel>({
  name: 'patients',
  defaults: {
    patients: [],
    selectedPatient: null,
    loading: false,
    error: null,
    lastFetched: null
  }
})
@Injectable()
export class PatientState {
  constructor(private patientService: PatientService) {}

  @Selector()
  static patients(state: PatientStateModel): Patient[] {
    return state.patients;
  }

  @Selector()
  static selectedPatient(state: PatientStateModel): Patient | null {
    return state.selectedPatient;
  }

  @Selector()
  static loading(state: PatientStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: PatientStateModel): string | null {
    return state.error;
  }

  @Selector()
  static lastFetched(state: PatientStateModel): Date | null {
    return state.lastFetched;
  }

  @Selector()
  static patientsCount(state: PatientStateModel): number {
    return state.patients.length;
  }

  @Action(LoadPatients)
  loadPatients(ctx: StateContext<PatientStateModel>) {
    ctx.patchState({ loading: true, error: null });
    
    return this.patientService.getAllPatients().pipe(
      tap((patients: Patient[]) => {
        ctx.dispatch(new LoadPatientsSuccess(patients));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadPatientsFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadPatientsSuccess)
  loadPatientsSuccess(ctx: StateContext<PatientStateModel>, action: LoadPatientsSuccess) {
    ctx.patchState({
      patients: action.payload,
      loading: false,
      error: null,
      lastFetched: new Date()
    });
  }

  @Action(LoadPatientsFailure)
  loadPatientsFailure(ctx: StateContext<PatientStateModel>, action: LoadPatientsFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(LoadPatient)
  loadPatient(ctx: StateContext<PatientStateModel>, action: LoadPatient) {
    ctx.patchState({ loading: true, error: null });
    
    return this.patientService.getPatientById(action.payload.id).pipe(
      tap((patient: Patient) => {
        ctx.dispatch(new LoadPatientSuccess(patient));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadPatientFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadPatientSuccess)
  loadPatientSuccess(ctx: StateContext<PatientStateModel>, action: LoadPatientSuccess) {
    ctx.patchState({
      selectedPatient: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(LoadPatientFailure)
  loadPatientFailure(ctx: StateContext<PatientStateModel>, action: LoadPatientFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(CreatePatient)
  createPatient(ctx: StateContext<PatientStateModel>, action: CreatePatient) {
    ctx.patchState({ loading: true, error: null });
    
    return this.patientService.createPatient(action.payload).pipe(
      tap((patient: Patient) => {
        ctx.dispatch(new CreatePatientSuccess(patient));
      }),
      catchError((error) => {
        ctx.dispatch(new CreatePatientFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(CreatePatientSuccess)
  createPatientSuccess(ctx: StateContext<PatientStateModel>, action: CreatePatientSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      patients: [...state.patients, action.payload],
      loading: false,
      error: null
    });
  }

  @Action(CreatePatientFailure)
  createPatientFailure(ctx: StateContext<PatientStateModel>, action: CreatePatientFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(UpdatePatient)
  updatePatient(ctx: StateContext<PatientStateModel>, action: UpdatePatient) {
    ctx.patchState({ loading: true, error: null });
    
    return this.patientService.updatePatient(action.payload.id, action.payload.data).pipe(
      tap((patient: Patient) => {
        ctx.dispatch(new UpdatePatientSuccess(patient));
      }),
      catchError((error) => {
        ctx.dispatch(new UpdatePatientFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(UpdatePatientSuccess)
  updatePatientSuccess(ctx: StateContext<PatientStateModel>, action: UpdatePatientSuccess) {
    const state = ctx.getState();
    const updatedPatients = state.patients.map((patient: Patient) => 
      patient.patientId === action.payload.patientId ? action.payload : patient
    );
    
    ctx.patchState({
      patients: updatedPatients,
      selectedPatient: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(UpdatePatientFailure)
  updatePatientFailure(ctx: StateContext<PatientStateModel>, action: UpdatePatientFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(DeletePatient)
  deletePatient(ctx: StateContext<PatientStateModel>, action: DeletePatient) {
    ctx.patchState({ loading: true, error: null });
    
    return this.patientService.deletePatient(action.payload.id).pipe(
      tap(() => {
        ctx.dispatch(new DeletePatientSuccess({ id: action.payload.id }));
      }),
      catchError((error) => {
        ctx.dispatch(new DeletePatientFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(DeletePatientSuccess)
  deletePatientSuccess(ctx: StateContext<PatientStateModel>, action: DeletePatientSuccess) {
    const state = ctx.getState();
    const filteredPatients = state.patients.filter((patient: Patient) => patient.patientId !== action.payload.id);
    
    ctx.patchState({
      patients: filteredPatients,
      selectedPatient: state.selectedPatient?.patientId === action.payload.id ? null : state.selectedPatient,
      loading: false,
      error: null
    });
  }

  @Action(DeletePatientFailure)
  deletePatientFailure(ctx: StateContext<PatientStateModel>, action: DeletePatientFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(ClearPatientError)
  clearPatientError(ctx: StateContext<PatientStateModel>) {
    ctx.patchState({ error: null });
  }
}
