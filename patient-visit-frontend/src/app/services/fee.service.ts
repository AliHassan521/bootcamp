import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fee, CreateFeeDto, UpdateFeeDto } from '../models/fee.model';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private apiUrl = 'http://localhost:5147/api/fees';

  constructor(private http: HttpClient) { }

  getAllFees(): Observable<Fee[]> {
    return this.http.get<Fee[]>(this.apiUrl);
  }

  getFeeById(id: number): Observable<Fee> {
    return this.http.get<Fee>(`${this.apiUrl}/${id}`);
  }

  createFee(fee: CreateFeeDto): Observable<any> {
    return this.http.post(this.apiUrl, fee);
  }

  updateFee(id: number, fee: UpdateFeeDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fee);
  }

  deleteFee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


