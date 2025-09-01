import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { VisitService } from '../../services/visit.service';
import { Visit } from '../../models/visit.model';
import {
  LoadVisits,
  LoadVisitsSuccess,
  LoadVisitsFailure,
  LoadVisit,
  LoadVisitSuccess,
  LoadVisitFailure,
  CreateVisit,
  CreateVisitSuccess,
  CreateVisitFailure,
  UpdateVisit,
  UpdateVisitSuccess,
  UpdateVisitFailure,
  DeleteVisit,
  DeleteVisitSuccess,
  DeleteVisitFailure,
  ClearVisitError
} from '../actions/visit.actions';

export interface VisitStateModel {
  visits: Visit[];
  selectedVisit: Visit | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

@State<VisitStateModel>({
  name: 'visits',
  defaults: {
    visits: [],
    selectedVisit: null,
    loading: false,
    error: null,
    lastFetched: null
  }
})
@Injectable()
export class VisitState {
  constructor(private visitService: VisitService) {}

  @Selector()
  static visits(state: VisitStateModel): Visit[] {
    return state.visits;
  }

  @Selector()
  static selectedVisit(state: VisitStateModel): Visit | null {
    return state.selectedVisit;
  }

  @Selector()
  static loading(state: VisitStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: VisitStateModel): string | null {
    return state.error;
  }

  @Selector()
  static lastFetched(state: VisitStateModel): Date | null {
    return state.lastFetched;
  }

  @Selector()
  static visitsCount(state: VisitStateModel): number {
    return state.visits.length;
  }

  @Action(LoadVisits)
  loadVisits(ctx: StateContext<VisitStateModel>) {
    ctx.patchState({ loading: true, error: null });
    
    return this.visitService.getAllVisits().pipe(
      tap((visits: Visit[]) => {
        ctx.dispatch(new LoadVisitsSuccess(visits));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadVisitsFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadVisitsSuccess)
  loadVisitsSuccess(ctx: StateContext<VisitStateModel>, action: LoadVisitsSuccess) {
    ctx.patchState({
      visits: action.payload,
      loading: false,
      error: null,
      lastFetched: new Date()
    });
  }

  @Action(LoadVisitsFailure)
  loadVisitsFailure(ctx: StateContext<VisitStateModel>, action: LoadVisitsFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(LoadVisit)
  loadVisit(ctx: StateContext<VisitStateModel>, action: LoadVisit) {
    ctx.patchState({ loading: true, error: null });
    
    return this.visitService.getVisitById(action.payload.id).pipe(
      tap((visit: Visit) => {
        ctx.dispatch(new LoadVisitSuccess(visit));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadVisitFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadVisitSuccess)
  loadVisitSuccess(ctx: StateContext<VisitStateModel>, action: LoadVisitSuccess) {
    ctx.patchState({
      selectedVisit: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(LoadVisitFailure)
  loadVisitFailure(ctx: StateContext<VisitStateModel>, action: LoadVisitFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(CreateVisit)
  createVisit(ctx: StateContext<VisitStateModel>, action: CreateVisit) {
    ctx.patchState({ loading: true, error: null });
    
    return this.visitService.createVisit(action.payload).pipe(
      tap((visit: Visit) => {
        ctx.dispatch(new CreateVisitSuccess(visit));
      }),
      catchError((error) => {
        ctx.dispatch(new CreateVisitFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(CreateVisitSuccess)
  createVisitSuccess(ctx: StateContext<VisitStateModel>, action: CreateVisitSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      visits: [...state.visits, action.payload],
      loading: false,
      error: null
    });
  }

  @Action(CreateVisitFailure)
  createVisitFailure(ctx: StateContext<VisitStateModel>, action: CreateVisitFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(UpdateVisit)
  updateVisit(ctx: StateContext<VisitStateModel>, action: UpdateVisit) {
    ctx.patchState({ loading: true, error: null });
    
    return this.visitService.updateVisit(action.payload.id, action.payload.data).pipe(
      tap((visit: Visit) => {
        ctx.dispatch(new UpdateVisitSuccess(visit));
      }),
      catchError((error) => {
        ctx.dispatch(new UpdateVisitFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(UpdateVisitSuccess)
  updateVisitSuccess(ctx: StateContext<VisitStateModel>, action: UpdateVisitSuccess) {
    const state = ctx.getState();
    const updatedVisits = state.visits.map((visit: Visit) => 
      visit.visitId === action.payload.visitId ? action.payload : visit
    );
    
    ctx.patchState({
      visits: updatedVisits,
      selectedVisit: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(UpdateVisitFailure)
  updateVisitFailure(ctx: StateContext<VisitStateModel>, action: UpdateVisitFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(DeleteVisit)
  deleteVisit(ctx: StateContext<VisitStateModel>, action: DeleteVisit) {
    ctx.patchState({ loading: true, error: null });
    
    return this.visitService.deleteVisit(action.payload.id).pipe(
      tap(() => {
        ctx.dispatch(new DeleteVisitSuccess({ id: action.payload.id }));
      }),
      catchError((error) => {
        ctx.dispatch(new DeleteVisitFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(DeleteVisitSuccess)
  deleteVisitSuccess(ctx: StateContext<VisitStateModel>, action: DeleteVisitSuccess) {
    const state = ctx.getState();
    const filteredVisits = state.visits.filter((visit: Visit) => visit.visitId !== action.payload.id);
    
    ctx.patchState({
      visits: filteredVisits,
      selectedVisit: state.selectedVisit?.visitId === action.payload.id ? null : state.selectedVisit,
      loading: false,
      error: null
    });
  }

  @Action(DeleteVisitFailure)
  deleteVisitFailure(ctx: StateContext<VisitStateModel>, action: DeleteVisitFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(ClearVisitError)
  clearVisitError(ctx: StateContext<VisitStateModel>) {
    ctx.patchState({ error: null });
  }
}
