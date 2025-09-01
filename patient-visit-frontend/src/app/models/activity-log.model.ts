export interface ActivityLog {
  logId: number;
  userId: number;
  action: string;
  timestamp: Date;
  details?: string;
  username?: string;
}

