export interface Fee {
  feeId: number;
  serviceName: string;
  amount: number;
}

export interface CreateFeeDto {
  serviceName: string;
  amount: number;
}

export interface UpdateFeeDto extends CreateFeeDto {
  feeId: number;
}

