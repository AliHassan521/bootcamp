import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import {
  LoadDoctors,
  LoadDoctorsSuccess,
  LoadDoctorsFailure,
  LoadDoctor,
  LoadDoctorSuccess,
  LoadDoctorFailure,
  CreateDoctor,
  CreateDoctorSuccess,
  CreateDoctorFailure,
  UpdateDoctor,
  UpdateDoctorSuccess,
  UpdateDoctorFailure,
  DeleteDoctor,
  DeleteDoctorSuccess,
  DeleteDoctorFailure,
  ClearDoctorError
} from '../actions/doctor.actions';

export interface DoctorStateModel {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

@State<DoctorStateModel>({
  name: 'doctors',
  defaults: {
    doctors: [],
    selectedDoctor: null,
    loading: false,
    error: null,
    lastFetched: null
  }
})
@Injectable()
export class DoctorState {
  constructor(private doctorService: DoctorService) {}

  @Selector()
  static doctors(state: DoctorStateModel): Doctor[] {
    return state.doctors;
  }

  @Selector()
  static selectedDoctor(state: DoctorStateModel): Doctor | null {
    return state.selectedDoctor;
  }

  @Selector()
  static loading(state: DoctorStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: DoctorStateModel): string | null {
    return state.error;
  }

  @Selector()
  static lastFetched(state: DoctorStateModel): Date | null {
    return state.lastFetched;
  }

  @Selector()
  static doctorsCount(state: DoctorStateModel): number {
    return state.doctors.length;
  }

  @Action(LoadDoctors)
  loadDoctors(ctx: StateContext<DoctorStateModel>) {
    ctx.patchState({ loading: true, error: null });
    
    return this.doctorService.getAllDoctors().pipe(
      tap((doctors: Doctor[]) => {
        ctx.dispatch(new LoadDoctorsSuccess(doctors));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadDoctorsFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadDoctorsSuccess)
  loadDoctorsSuccess(ctx: StateContext<DoctorStateModel>, action: LoadDoctorsSuccess) {
    ctx.patchState({
      doctors: action.payload,
      loading: false,
      error: null,
      lastFetched: new Date()
    });
  }

  @Action(LoadDoctorsFailure)
  loadDoctorsFailure(ctx: StateContext<DoctorStateModel>, action: LoadDoctorsFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(LoadDoctor)
  loadDoctor(ctx: StateContext<DoctorStateModel>, action: LoadDoctor) {
    ctx.patchState({ loading: true, error: null });
    
    return this.doctorService.getDoctorById(action.payload.id).pipe(
      tap((doctor: Doctor) => {
        ctx.dispatch(new LoadDoctorSuccess(doctor));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadDoctorFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadDoctorSuccess)
  loadDoctorSuccess(ctx: StateContext<DoctorStateModel>, action: LoadDoctorSuccess) {
    ctx.patchState({
      selectedDoctor: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(LoadDoctorFailure)
  loadDoctorFailure(ctx: StateContext<DoctorStateModel>, action: LoadDoctorFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(CreateDoctor)
  createDoctor(ctx: StateContext<DoctorStateModel>, action: CreateDoctor) {
    ctx.patchState({ loading: true, error: null });
    
    return this.doctorService.createDoctor(action.payload).pipe(
      tap((doctor: Doctor) => {
        ctx.dispatch(new CreateDoctorSuccess(doctor));
      }),
      catchError((error) => {
        ctx.dispatch(new CreateDoctorFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(CreateDoctorSuccess)
  createDoctorSuccess(ctx: StateContext<DoctorStateModel>, action: CreateDoctorSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      doctors: [...state.doctors, action.payload],
      loading: false,
      error: null
    });
  }

  @Action(CreateDoctorFailure)
  createDoctorFailure(ctx: StateContext<DoctorStateModel>, action: CreateDoctorFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(UpdateDoctor)
  updateDoctor(ctx: StateContext<DoctorStateModel>, action: UpdateDoctor) {
    ctx.patchState({ loading: true, error: null });
    
    return this.doctorService.updateDoctor(action.payload.id, action.payload.data).pipe(
      tap((doctor: Doctor) => {
        ctx.dispatch(new UpdateDoctorSuccess(doctor));
      }),
      catchError((error) => {
        ctx.dispatch(new UpdateDoctorFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(UpdateDoctorSuccess)
  updateDoctorSuccess(ctx: StateContext<DoctorStateModel>, action: UpdateDoctorSuccess) {
    const state = ctx.getState();
    const updatedDoctors = state.doctors.map((doctor: Doctor) => 
      doctor.doctorId === action.payload.doctorId ? action.payload : doctor
    );
    
    ctx.patchState({
      doctors: updatedDoctors,
      selectedDoctor: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(UpdateDoctorFailure)
  updateDoctorFailure(ctx: StateContext<DoctorStateModel>, action: UpdateDoctorFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(DeleteDoctor)
  deleteDoctor(ctx: StateContext<DoctorStateModel>, action: DeleteDoctor) {
    ctx.patchState({ loading: true, error: null });
    
    return this.doctorService.deleteDoctor(action.payload.id).pipe(
      tap(() => {
        ctx.dispatch(new DeleteDoctorSuccess({ id: action.payload.id }));
      }),
      catchError((error) => {
        ctx.dispatch(new DeleteDoctorFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(DeleteDoctorSuccess)
  deleteDoctorSuccess(ctx: StateContext<DoctorStateModel>, action: DeleteDoctorSuccess) {
    const state = ctx.getState();
    const filteredDoctors = state.doctors.filter((doctor: Doctor) => doctor.doctorId !== action.payload.id);
    
    ctx.patchState({
      doctors: filteredDoctors,
      selectedDoctor: state.selectedDoctor?.doctorId === action.payload.id ? null : state.selectedDoctor,
      loading: false,
      error: null
    });
  }

  @Action(DeleteDoctorFailure)
  deleteDoctorFailure(ctx: StateContext<DoctorStateModel>, action: DeleteDoctorFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(ClearDoctorError)
  clearDoctorError(ctx: StateContext<DoctorStateModel>) {
    ctx.patchState({ error: null });
  }
}
