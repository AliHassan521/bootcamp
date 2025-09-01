export interface Doctor {
  doctorId: number;
  firstName: string;
  lastName: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

export interface CreateDoctorDto {
  firstName: string;
  lastName: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

export interface UpdateDoctorDto extends CreateDoctorDto {
  doctorId: number;
}

