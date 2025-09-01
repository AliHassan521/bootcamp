import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visit, CreateVisitDto, UpdateVisitDto } from '../models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'http://localhost:5147/api/visits';

  constructor(private http: HttpClient) { }

  getAllVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.apiUrl);
  }

  getVisitById(id: number): Observable<Visit> {
    return this.http.get<Visit>(`${this.apiUrl}/${id}`);
  }

  createVisit(visit: CreateVisitDto): Observable<any> {
    return this.http.post(this.apiUrl, visit);
  }

  updateVisit(id: number, visit: UpdateVisitDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, visit);
  }

  deleteVisit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


