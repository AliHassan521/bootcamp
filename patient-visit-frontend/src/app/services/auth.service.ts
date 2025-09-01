import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, RegisterUserDto, LoginUserDto, ChangePasswordDto, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5147/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  register(userData: RegisterUserDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: LoginUserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.decodeAndStoreUser(response.token);
        })
      );
  }

  changePassword(changePasswordData: ChangePasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private decodeAndStoreUser(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        userId: payload.nameid || 0,
        username: payload.name || '',
        email: payload.email || '',
        role: payload.role || 'User'
      };
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeAndStoreUser(token);
    }
  }
}


