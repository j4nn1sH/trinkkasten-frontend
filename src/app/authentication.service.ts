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
    //console.log("Registering user: " + email)
    return this.http.post(API_URL + '/auth/register', {
      email,
      password,
      firstName,
      lastName
    }, httpOptions);
  }

  login(email: string, password: string): Observable<any> {
    //console.log("Logging in user: " + email)
    return this.http.post(API_URL + '/auth/login', {
      email,
      password
    }, httpOptions);
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): Observable<any> {
    return this.http.get(API_URL + '/auth/me');
  }

  setToken(res: any): void {
    const expiresAt = String(Date.now() + res.expiresIn * 1000);

    localStorage.setItem('auth-token', res.token);
    localStorage.setItem('expiresAt', expiresAt);
  }

  getToken(): string | null {
    if(!localStorage.getItem('auth-token') || !localStorage.getItem('expiresAt')) {
      return null;
    } else if(Date.now() > Number(localStorage.getItem('expiresAt'))) {
      this.clearToken();
      return null;
    }
    return localStorage.getItem('auth-token');
  }

  clearToken(): void {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('expiresAt');
  }
}
