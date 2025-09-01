export class LoadVisits {
  static readonly type = '[Visit] Load Visits';
}

export class LoadVisitsSuccess {
  static readonly type = '[Visit] Load Visits Success';
  constructor(public payload: any[]) {}
}

export class LoadVisitsFailure {
  static readonly type = '[Visit] Load Visits Failure';
  constructor(public payload: { error: string }) {}
}

export class LoadVisit {
  static readonly type = '[Visit] Load Visit';
  constructor(public payload: { id: number }) {}
}

export class LoadVisitSuccess {
  static readonly type = '[Visit] Load Visit Success';
  constructor(public payload: any) {}
}

export class LoadVisitFailure {
  static readonly type = '[Visit] Load Visit Failure';
  constructor(public payload: { error: string }) {}
}

export class CreateVisit {
  static readonly type = '[Visit] Create Visit';
  constructor(public payload: any) {}
}

export class CreateVisitSuccess {
  static readonly type = '[Visit] Create Visit Success';
  constructor(public payload: any) {}
}

export class CreateVisitFailure {
  static readonly type = '[Visit] Create Visit Failure';
  constructor(public payload: { error: string }) {}
}

export class UpdateVisit {
  static readonly type = '[Visit] Update Visit';
  constructor(public payload: { id: number; data: any }) {}
}

export class UpdateVisitSuccess {
  static readonly type = '[Visit] Update Visit Success';
  constructor(public payload: any) {}
}

export class UpdateVisitFailure {
  static readonly type = '[Visit] Update Visit Failure';
  constructor(public payload: { error: string }) {}
}

export class DeleteVisit {
  static readonly type = '[Visit] Delete Visit';
  constructor(public payload: { id: number }) {}
}

export class DeleteVisitSuccess {
  static readonly type = '[Visit] Delete Visit Success';
  constructor(public payload: { id: number }) {}
}

export class DeleteVisitFailure {
  static readonly type = '[Visit] Delete Visit Failure';
  constructor(public payload: { error: string }) {}
}

export class ClearVisitError {
  static readonly type = '[Visit] Clear Error';
}
