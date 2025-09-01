import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { AuthState } from './states/auth.state';
import { PatientState } from './states/patient.state';
import { DoctorState } from './states/doctor.state';
import { VisitState } from './states/visit.state';
import { FeeState } from './states/fee.state';
import { ActivityLogState } from './states/activity-log.state';

export interface AppStateModel {
  auth: any;
  patients: any;
  doctors: any;
  visits: any;
  fees: any;
  activityLogs: any;
}

@State<AppStateModel>({
  name: 'app',
  children: [
    AuthState,
    PatientState,
    DoctorState,
    VisitState,
    FeeState,
    ActivityLogState
  ]
})
@Injectable()
export class AppState {}
