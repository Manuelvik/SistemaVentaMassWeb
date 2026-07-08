import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  nombre: string = '';
  rol: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.nombre = this.authService.obtenerNombre();
    this.rol = this.authService.obtenerRol();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}
