export interface Visit {
  visitId: number;
  patientId: number;
  doctorId: number;
  visitDate: Date;
  notes?: string;
  status?: string;
  patientName?: string;
  doctorName?: string;
}

export interface CreateVisitDto {
  patientId: number;
  doctorId: number;
  visitDate: Date;
  notes?: string;
  status?: string;
}

export interface UpdateVisitDto extends CreateVisitDto {
  visitId: number;
}

