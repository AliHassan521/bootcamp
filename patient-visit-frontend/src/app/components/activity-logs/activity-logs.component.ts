import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { ActivityLog } from '../../models/activity-log.model';
import { LoadActivityLogs } from '../../store/actions/activity-log.actions';
import { ActivityLogState } from '../../store/states/activity-log.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Activity Logs</h2>

      @if (errorMessage()) {
        <div class="alert alert-danger">
          {{ errorMessage() }}
        </div>
      }

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading activity logs...</p>
        </div>
      }

      @if (!isLoading() && logs().length === 0) {
        <div class="text-center">
          <p>No activity logs found.</p>
        </div>
      }

      @if (!isLoading() && logs().length > 0) {
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            @for (log of logs(); track log.logId) {
              <tr>
                <td>{{ log.logId }}</td>
                <td>{{ log.username || 'Unknown' }}</td>
                <td>{{ log.action }}</td>
                <td>{{ log.timestamp | date:'short' }}</td>
                <td>{{ log.details }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `
})
export class ActivityLogsComponent implements OnInit {
  private store = inject(Store);

  // Signals for reactive state
  logs = signal<ActivityLog[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    // Subscribe to store state changes
    this.store.select(ActivityLogState.activityLogs)
      .pipe(takeUntilDestroyed())
      .subscribe(logs => this.logs.set(logs));

    this.store.select(ActivityLogState.loading)
      .pipe(takeUntilDestroyed())
      .subscribe(loading => this.isLoading.set(loading));

    this.store.select(ActivityLogState.error)
      .pipe(takeUntilDestroyed())
      .subscribe(error => {
        if (error) {
          this.errorMessage.set(error);
        }
      });
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    // Dispatch action to load activity logs
    this.store.dispatch(new LoadActivityLogs());
  }
}
