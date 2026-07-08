import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario: string = '';
  password: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  iniciarSesion(): void {
    this.error = '';

    if (!this.usuario || !this.password) {
      this.error = 'Ingrese usuario y contraseña';
      return;
    }

    this.cargando = true;

    this.authService
      .login({
        usuario: this.usuario,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.authService.guardarSesion(response);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.error = 'Usuario o contraseña incorrectos';
          this.cargando = false;
        },
      });
  }
}
