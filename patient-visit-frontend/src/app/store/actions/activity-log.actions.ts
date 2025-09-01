export class LoadActivityLogs {
  static readonly type = '[ActivityLog] Load Activity Logs';
}

export class LoadActivityLogsSuccess {
  static readonly type = '[ActivityLog] Load Activity Logs Success';
  constructor(public payload: any[]) {}
}

export class LoadActivityLogsFailure {
  static readonly type = '[ActivityLog] Load Activity Logs Failure';
  constructor(public payload: { error: string }) {}
}

export class LoadActivityLog {
  static readonly type = '[ActivityLog] Load Activity Log';
  constructor(public payload: { id: number }) {}
}

export class LoadActivityLogSuccess {
  static readonly type = '[ActivityLog] Load Activity Log Success';
  constructor(public payload: any) {}
}

export class LoadActivityLogFailure {
  static readonly type = '[ActivityLog] Load Activity Log Failure';
  constructor(public payload: { error: string }) {}
}

export class CreateActivityLog {
  static readonly type = '[ActivityLog] Create Activity Log';
  constructor(public payload: any) {}
}

export class CreateActivityLogSuccess {
  static readonly type = '[ActivityLog] Create Activity Log Success';
  constructor(public payload: any) {}
}

export class CreateActivityLogFailure {
  static readonly type = '[ActivityLog] Create Activity Log Failure';
  constructor(public payload: { error: string }) {}
}

export class UpdateActivityLog {
  static readonly type = '[ActivityLog] Update Activity Log';
  constructor(public payload: { id: number; data: any }) {}
}

export class UpdateActivityLogSuccess {
  static readonly type = '[ActivityLog] Update Activity Log Success';
  constructor(public payload: any) {}
}

export class UpdateActivityLogFailure {
  static readonly type = '[ActivityLog] Update Activity Log Failure';
  constructor(public payload: { error: string }) {}
}

export class DeleteActivityLog {
  static readonly type = '[ActivityLog] Delete Activity Log';
  constructor(public payload: { id: number }) {}
}

export class DeleteActivityLogSuccess {
  static readonly type = '[ActivityLog] Delete Activity Log Success';
  constructor(public payload: { id: number }) {}
}

export class DeleteActivityLogFailure {
  static readonly type = '[ActivityLog] Delete Activity Log Failure';
  constructor(public payload: { error: string }) {}
}

export class ClearActivityLogError {
  static readonly type = '[ActivityLog] Clear Error';
}
