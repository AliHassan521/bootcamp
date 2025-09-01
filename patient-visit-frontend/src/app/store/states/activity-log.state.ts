import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivityLogService } from '../../services/activity-log.service';
import { ActivityLog } from '../../models/activity-log.model';
import {
  LoadActivityLogs,
  LoadActivityLogsSuccess,
  LoadActivityLogsFailure,
  LoadActivityLog,
  LoadActivityLogSuccess,
  LoadActivityLogFailure,
  CreateActivityLog,
  CreateActivityLogSuccess,
  CreateActivityLogFailure,
  UpdateActivityLog,
  UpdateActivityLogSuccess,
  UpdateActivityLogFailure,
  DeleteActivityLog,
  DeleteActivityLogSuccess,
  DeleteActivityLogFailure,
  ClearActivityLogError
} from '../actions/activity-log.actions';

export interface ActivityLogStateModel {
  activityLogs: ActivityLog[];
  selectedActivityLog: ActivityLog | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

@State<ActivityLogStateModel>({
  name: 'activityLogs',
  defaults: {
    activityLogs: [],
    selectedActivityLog: null,
    loading: false,
    error: null,
    lastFetched: null
  }
})
@Injectable()
export class ActivityLogState {
  constructor(private activityLogService: ActivityLogService) {}

  @Selector()
  static activityLogs(state: ActivityLogStateModel): ActivityLog[] {
    return state.activityLogs;
  }

  @Selector()
  static selectedActivityLog(state: ActivityLogStateModel): ActivityLog | null {
    return state.selectedActivityLog;
  }

  @Selector()
  static loading(state: ActivityLogStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: ActivityLogStateModel): string | null {
    return state.error;
  }

  @Selector()
  static lastFetched(state: ActivityLogStateModel): Date | null {
    return state.lastFetched;
  }

  @Selector()
  static activityLogsCount(state: ActivityLogStateModel): number {
    return state.activityLogs.length;
  }

  @Action(LoadActivityLogs)
  loadActivityLogs(ctx: StateContext<ActivityLogStateModel>) {
    ctx.patchState({ loading: true, error: null });
    
    return this.activityLogService.getAllLogs().pipe(
      tap((activityLogs: ActivityLog[]) => {
        ctx.dispatch(new LoadActivityLogsSuccess(activityLogs));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadActivityLogsFailure({ error: error.message }));
        return of(null);
      })
    );
  }

  @Action(LoadActivityLogsSuccess)
  loadActivityLogsSuccess(ctx: StateContext<ActivityLogStateModel>, action: LoadActivityLogsSuccess) {
    ctx.patchState({
      activityLogs: action.payload,
      loading: false,
      error: null,
      lastFetched: new Date()
    });
  }

  @Action(LoadActivityLogsFailure)
  loadActivityLogsFailure(ctx: StateContext<ActivityLogStateModel>, action: LoadActivityLogsFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(LoadActivityLog)
  loadActivityLog(ctx: StateContext<ActivityLogStateModel>, action: LoadActivityLog) {
    // Since the service doesn't have getById, we'll find it from the loaded logs
    const state = ctx.getState();
    const activityLog = state.activityLogs.find(log => log.logId === action.payload.id);
    if (activityLog) {
      ctx.dispatch(new LoadActivityLogSuccess(activityLog));
    } else {
      ctx.dispatch(new LoadActivityLogFailure({ error: 'Activity log not found' }));
    }
  }

  @Action(LoadActivityLogSuccess)
  loadActivityLogSuccess(ctx: StateContext<ActivityLogStateModel>, action: LoadActivityLogSuccess) {
    ctx.patchState({
      selectedActivityLog: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(LoadActivityLogFailure)
  loadActivityLogFailure(ctx: StateContext<ActivityLogStateModel>, action: LoadActivityLogFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(CreateActivityLog)
  createActivityLog(ctx: StateContext<ActivityLogStateModel>, action: CreateActivityLog) {
    // Since the service doesn't have create method, we'll simulate it
    ctx.patchState({ loading: true, error: null });
    
    // Simulate API call
    setTimeout(() => {
      const newLog: ActivityLog = {
        logId: Date.now(),
        userId: 1,
        action: action.payload.action || 'Created',
        timestamp: new Date(),
        details: action.payload.details
      };
      ctx.dispatch(new CreateActivityLogSuccess(newLog));
    }, 100);
  }

  @Action(CreateActivityLogSuccess)
  createActivityLogSuccess(ctx: StateContext<ActivityLogStateModel>, action: CreateActivityLogSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      activityLogs: [...state.activityLogs, action.payload],
      loading: false,
      error: null
    });
  }

  @Action(CreateActivityLogFailure)
  createActivityLogFailure(ctx: StateContext<ActivityLogStateModel>, action: CreateActivityLogFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(UpdateActivityLog)
  updateActivityLog(ctx: StateContext<ActivityLogStateModel>, action: UpdateActivityLog) {
    // Since the service doesn't have update method, we'll simulate it
    ctx.patchState({ loading: true, error: null });
    
    setTimeout(() => {
      const state = ctx.getState();
      const existingLog = state.activityLogs.find(log => log.logId === action.payload.id);
      if (existingLog) {
        const updatedLog = { ...existingLog, ...action.payload.data };
        ctx.dispatch(new UpdateActivityLogSuccess(updatedLog));
      } else {
        ctx.dispatch(new UpdateActivityLogFailure({ error: 'Activity log not found' }));
      }
    }, 100);
  }

  @Action(UpdateActivityLogSuccess)
  updateActivityLogSuccess(ctx: StateContext<ActivityLogStateModel>, action: UpdateActivityLogSuccess) {
    const state = ctx.getState();
    const updatedActivityLogs = state.activityLogs.map((activityLog: ActivityLog) => 
      activityLog.logId === action.payload.logId ? action.payload : activityLog
    );
    
    ctx.patchState({
      activityLogs: updatedActivityLogs,
      selectedActivityLog: action.payload,
      loading: false,
      error: null
    });
  }

  @Action(UpdateActivityLogFailure)
  updateActivityLogFailure(ctx: StateContext<ActivityLogStateModel>, action: UpdateActivityLogFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(DeleteActivityLog)
  deleteActivityLog(ctx: StateContext<ActivityLogStateModel>, action: DeleteActivityLog) {
    // Since the service doesn't have delete method, we'll simulate it
    ctx.patchState({ loading: true, error: null });
    
    setTimeout(() => {
      ctx.dispatch(new DeleteActivityLogSuccess({ id: action.payload.id }));
    }, 100);
  }

  @Action(DeleteActivityLogSuccess)
  deleteActivityLogSuccess(ctx: StateContext<ActivityLogStateModel>, action: DeleteActivityLogSuccess) {
    const state = ctx.getState();
    const filteredActivityLogs = state.activityLogs.filter((activityLog: ActivityLog) => activityLog.logId !== action.payload.id);
    
    ctx.patchState({
      activityLogs: filteredActivityLogs,
      selectedActivityLog: state.selectedActivityLog?.logId === action.payload.id ? null : state.selectedActivityLog,
      loading: false,
      error: null
    });
  }

  @Action(DeleteActivityLogFailure)
  deleteActivityLogFailure(ctx: StateContext<ActivityLogStateModel>, action: DeleteActivityLogFailure) {
    ctx.patchState({
      loading: false,
      error: action.payload.error
    });
  }

  @Action(ClearActivityLogError)
  clearActivityLogError(ctx: StateContext<ActivityLogStateModel>) {
    ctx.patchState({ error: null });
  }
}
