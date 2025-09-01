export class LoadFees {
  static readonly type = '[Fee] Load Fees';
}

export class LoadFeesSuccess {
  static readonly type = '[Fee] Load Fees Success';
  constructor(public payload: any[]) {}
}

export class LoadFeesFailure {
  static readonly type = '[Fee] Load Fees Failure';
  constructor(public payload: { error: string }) {}
}

export class LoadFee {
  static readonly type = '[Fee] Load Fee';
  constructor(public payload: { id: number }) {}
}

export class LoadFeeSuccess {
  static readonly type = '[Fee] Load Fee Success';
  constructor(public payload: any) {}
}

export class LoadFeeFailure {
  static readonly type = '[Fee] Load Fee Failure';
  constructor(public payload: { error: string }) {}
}

export class CreateFee {
  static readonly type = '[Fee] Create Fee';
  constructor(public payload: any) {}
}

export class CreateFeeSuccess {
  static readonly type = '[Fee] Create Fee Success';
  constructor(public payload: any) {}
}

export class CreateFeeFailure {
  static readonly type = '[Fee] Create Fee Failure';
  constructor(public payload: { error: string }) {}
}

export class UpdateFee {
  static readonly type = '[Fee] Update Fee';
  constructor(public payload: { id: number; data: any }) {}
}

export class UpdateFeeSuccess {
  static readonly type = '[Fee] Update Fee Success';
  constructor(public payload: any) {}
}

export class UpdateFeeFailure {
  static readonly type = '[Fee] Update Fee Failure';
  constructor(public payload: { error: string }) {}
}

export class DeleteFee {
  static readonly type = '[Fee] Delete Fee';
  constructor(public payload: { id: number }) {}
}

export class DeleteFeeSuccess {
  static readonly type = '[Fee] Delete Fee Success';
  constructor(public payload: { id: number }) {}
}

export class DeleteFeeFailure {
  static readonly type = '[Fee] Delete Fee Failure';
  constructor(public payload: { error: string }) {}
}

export class ClearFeeError {
  static readonly type = '[Fee] Clear Error';
}
