export class LoadDoctors {
  static readonly type = '[Doctor] Load Doctors';
}

export class LoadDoctorsSuccess {
  static readonly type = '[Doctor] Load Doctors Success';
  constructor(public payload: any[]) {}
}

export class LoadDoctorsFailure {
  static readonly type = '[Doctor] Load Doctors Failure';
  constructor(public payload: { error: string }) {}
}

export class LoadDoctor {
  static readonly type = '[Doctor] Load Doctor';
  constructor(public payload: { id: number }) {}
}

export class LoadDoctorSuccess {
  static readonly type = '[Doctor] Load Doctor Success';
  constructor(public payload: any) {}
}

export class LoadDoctorFailure {
  static readonly type = '[Doctor] Load Doctor Failure';
  constructor(public payload: { error: string }) {}
}

export class CreateDoctor {
  static readonly type = '[Doctor] Create Doctor';
  constructor(public payload: any) {}
}

export class CreateDoctorSuccess {
  static readonly type = '[Doctor] Create Doctor Success';
  constructor(public payload: any) {}
}

export class CreateDoctorFailure {
  static readonly type = '[Doctor] Create Doctor Failure';
  constructor(public payload: { error: string }) {}
}

export class UpdateDoctor {
  static readonly type = '[Doctor] Update Doctor';
  constructor(public payload: { id: number; data: any }) {}
}

export class UpdateDoctorSuccess {
  static readonly type = '[Doctor] Update Doctor Success';
  constructor(public payload: any) {}
}

export class UpdateDoctorFailure {
  static readonly type = '[Doctor] Update Doctor Failure';
  constructor(public payload: { error: string }) {}
}

export class DeleteDoctor {
  static readonly type = '[Doctor] Delete Doctor';
  constructor(public payload: { id: number }) {}
}

export class DeleteDoctorSuccess {
  static readonly type = '[Doctor] Delete Doctor Success';
  constructor(public payload: { id: number }) {}
}

export class DeleteDoctorFailure {
  static readonly type = '[Doctor] Delete Doctor Failure';
  constructor(public payload: { error: string }) {}
}

export class ClearDoctorError {
  static readonly type = '[Doctor] Clear Error';
}
