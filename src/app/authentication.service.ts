import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) {}

  register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    return this.http.post(API_URL + '/auth/register', {
      email,
      password,
      firstName,
      lastName
    }, httpOptions);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(API_URL + '/auth/login', {
      email,
      password
    }, httpOptions);
  }

  logout(): void {
    this.clearToken();
  }

  me(): Observable<any> {
    return this.http.get(API_URL + '/auth/me');
  }

  setToken(res: any): void {
    localStorage.setItem('auth-token', res.token);
  }

  getToken(): string | null {
    if(!localStorage.getItem('auth-token')) {
      return null;
    }
    return localStorage.getItem('auth-token');
  }

  clearToken(): void {
    localStorage.removeItem('auth-token');
  }
}
