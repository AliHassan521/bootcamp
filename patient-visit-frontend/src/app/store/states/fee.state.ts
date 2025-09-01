import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FeeService } from '../../services/fee.service';
import { Fee } from '../../models/fee.model';
import {
  LoadFees,
  LoadFeesSuccess,
  LoadFeesFailure,
  LoadFee,
  LoadFeeSuccess,
  LoadFeeFailure,
  CreateFee,
  CreateFeeSuccess,
  CreateFeeFailure,
  UpdateFee,
  UpdateFeeSuccess,
  UpdateFeeFailure,
  DeleteFee,
  DeleteFeeSuccess,
  DeleteFeeFailure,
  ClearFeeError
} from '../actions/fee.actions';

export interface FeeStateModel {
  fees: Fee[];
  selectedFee: Fee | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

@State<FeeStateModel>({
  name: 'fees',
  defaults: {
    fees: [],
    selectedFee: null,
    loading: false,
    error: null,
    lastFetched: null
  }
})
@Injectable()
export class FeeState {
  constructor(private feeService: FeeService) {}

  @Selector()
  static fees(state: FeeStateModel): Fee[] {
    return state.fees;
  }

  @Selector()
  static selectedFee(state: FeeStateModel): Fee | null {
    return state.selectedFee;
  }

  @Selector()
  static loading(state: FeeStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: FeeStateModel): string | null {
    return state.error;
  }

  @Selector()
  static lastFetched(state: FeeStateModel): Date | null {
    return state.lastFetched;
  }

  @Selector()
  static feesCount(state: FeeStateModel): number {
    return state.fees.length;
  }

  @Action(LoadFees)
  loadFees(ctx: StateContext<FeeStateModel>) {
    ctx.patchState({ loading: true, error: null });
    
    return this.feeService.getAllFees().pipe(
      tap((fees: Fee[]) => {
        ctx.dispatch(new LoadFeesSuccess(fees));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadFeesFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadFeesSuccess)
  loadFeesSuccess(ctx: StateContext<FeeStateModel>, action: LoadFeesSuccess) {
    ctx.patchState({
      fees: action.payload,
      loading: false,
      error: null,
      lastFetched: new Date()
    });
  }

  @Action(LoadFeesFailure)
  loadFeesFailure(ctx: StateContext<FeeStateModel>, action: LoadFeesFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(LoadFee)
  loadFee(ctx: StateContext<FeeStateModel>, action: LoadFee) {
    ctx.patchState({ loading: true, error: null });
    
    return this.feeService.getFeeById(action.payload.id).pipe(
      tap((fee: Fee) => {
        ctx.dispatch(new LoadFeeSuccess(fee));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadFeeFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadFeeSuccess)
  loadFeeSuccess(ctx: StateContext<FeeStateModel>, action: LoadFeeSuccess) {
    ctx.patchState({
      selectedFee: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(LoadFeeFailure)
  loadFeeFailure(ctx: StateContext<FeeStateModel>, action: LoadFeeFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(CreateFee)
  createFee(ctx: StateContext<FeeStateModel>, action: CreateFee) {
    ctx.patchState({ loading: true, error: null });
    
    return this.feeService.createFee(action.payload).pipe(
      tap((fee: Fee) => {
        ctx.dispatch(new CreateFeeSuccess(fee));
      }),
      catchError((error) => {
        ctx.dispatch(new CreateFeeFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(CreateFeeSuccess)
  createFeeSuccess(ctx: StateContext<FeeStateModel>, action: CreateFeeSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      fees: [...state.fees, action.payload],
      loading: false,
      error: null
    });
  }

  @Action(CreateFeeFailure)
  createFeeFailure(ctx: StateContext<FeeStateModel>, action: CreateFeeFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(UpdateFee)
  updateFee(ctx: StateContext<FeeStateModel>, action: UpdateFee) {
    ctx.patchState({ loading: true, error: null });
    
    return this.feeService.updateFee(action.payload.id, action.payload.data).pipe(
      tap((fee: Fee) => {
        ctx.dispatch(new UpdateFeeSuccess(fee));
      }),
      catchError((error) => {
        ctx.dispatch(new UpdateFeeFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(UpdateFeeSuccess)
  updateFeeSuccess(ctx: StateContext<FeeStateModel>, action: UpdateFeeSuccess) {
    const state = ctx.getState();
    const updatedFees = state.fees.map((fee: Fee) => 
      fee.feeId === action.payload.feeId ? action.payload : fee
    );
    
    ctx.patchState({
      fees: updatedFees,
      selectedFee: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(UpdateFeeFailure)
  updateFeeFailure(ctx: StateContext<FeeStateModel>, action: UpdateFeeFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(DeleteFee)
  deleteFee(ctx: StateContext<FeeStateModel>, action: DeleteFee) {
    ctx.patchState({ loading: true, error: null });
    
    return this.feeService.deleteFee(action.payload.id).pipe(
      tap(() => {
        ctx.dispatch(new DeleteFeeSuccess({ id: action.payload.id }));
      }),
      catchError((error) => {
        ctx.dispatch(new DeleteFeeFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(DeleteFeeSuccess)
  deleteFeeSuccess(ctx: StateContext<FeeStateModel>, action: DeleteFeeSuccess) {
    const state = ctx.getState();
    const filteredFees = state.fees.filter((fee: Fee) => fee.feeId !== action.payload.id);
    
    ctx.patchState({
      fees: filteredFees,
      selectedFee: state.selectedFee?.feeId === action.payload.id ? null : state.selectedFee,
      loading: false,
      error: null
    });
  }

  @Action(DeleteFeeFailure)
  deleteFeeFailure(ctx: StateContext<FeeStateModel>, action: DeleteFeeFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(ClearFeeError)
  clearFeeError(ctx: StateContext<FeeStateModel>) {
    ctx.patchState({ error: null });
  }
}
