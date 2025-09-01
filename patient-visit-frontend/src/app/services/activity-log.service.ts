import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLog } from '../models/activity-log.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private apiUrl = 'http://localhost:5147/api/activitylogs';

  constructor(private http: HttpClient) { }

  getAllLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(this.apiUrl);
  }
}


