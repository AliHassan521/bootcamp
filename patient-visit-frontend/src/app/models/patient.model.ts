export interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdatePatientDto extends CreatePatientDto {
  patientId: number;
}

