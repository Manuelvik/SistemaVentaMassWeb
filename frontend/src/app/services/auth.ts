import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  guardarSesion(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuario', response.usuario);
    localStorage.setItem('nombre', response.nombre);
    localStorage.setItem('rol', response.rol);
  }

  cerrarSesion(): void {
    localStorage.clear();
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerNombre(): string {
    return localStorage.getItem('nombre') || '';
  }

  obtenerRol(): string {
    return localStorage.getItem('rol') || '';
  }
}
