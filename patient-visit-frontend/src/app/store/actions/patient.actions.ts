export class LoadPatients {
  static readonly type = '[Patient] Load Patients';
}

export class LoadPatientsSuccess {
  static readonly type = '[Patient] Load Patients Success';
  constructor(public payload: any[]) {}
}

export class LoadPatientsFailure {
  static readonly type = '[Patient] Load Patients Failure';
  constructor(public payload: { error: string }) {}
}

export class LoadPatient {
  static readonly type = '[Patient] Load Patient';
  constructor(public payload: { id: number }) {}
}

export class LoadPatientSuccess {
  static readonly type = '[Patient] Load Patient Success';
  constructor(public payload: any) {}
}

export class LoadPatientFailure {
  static readonly type = '[Patient] Load Patient Failure';
  constructor(public payload: { error: string }) {}
}

export class CreatePatient {
  static readonly type = '[Patient] Create Patient';
  constructor(public payload: any) {}
}

export class CreatePatientSuccess {
  static readonly type = '[Patient] Create Patient Success';
  constructor(public payload: any) {}
}

export class CreatePatientFailure {
  static readonly type = '[Patient] Create Patient Failure';
  constructor(public payload: { error: string }) {}
}

export class UpdatePatient {
  static readonly type = '[Patient] Update Patient';
  constructor(public payload: { id: number; data: any }) {}
}

export class UpdatePatientSuccess {
  static readonly type = '[Patient] Update Patient Success';
  constructor(public payload: any) {}
}

export class UpdatePatientFailure {
  static readonly type = '[Patient] Update Patient Failure';
  constructor(public payload: { error: string }) {}
}

export class DeletePatient {
  static readonly type = '[Patient] Delete Patient';
  constructor(public payload: { id: number }) {}
}

export class DeletePatientSuccess {
  static readonly type = '[Patient] Delete Patient Success';
  constructor(public payload: { id: number }) {}
}

export class DeletePatientFailure {
  static readonly type = '[Patient] Delete Patient Failure';
  constructor(public payload: { error: string }) {}
}

export class ClearPatientError {
  static readonly type = '[Patient] Clear Error';
}
