import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { ProveedorService } from '../../services/proveedor';
import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'app-proveedores',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores implements OnInit {
  proveedores: Proveedor[] = [];

  proveedor: Proveedor = {
    ruc: '',
    nombre: '',
    telefono: '',
    direccion: '',
  };

  editando: boolean = false;
  proveedorIdEditando?: number;

  mensaje: string = '';
  error: string = '';

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.listarProveedores();
  }

  listarProveedores(): void {
    this.proveedorService.listar().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: () => {
        this.error = 'Error al listar proveedores';
      },
    });
  }

  guardarProveedor(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.proveedor.ruc || !this.proveedor.nombre) {
      this.error = 'RUC y nombre son obligatorios';
      return;
    }

    if (this.editando && this.proveedorIdEditando) {
      this.proveedorService.actualizar(this.proveedorIdEditando, this.proveedor).subscribe({
        next: () => {
          this.mensaje = 'Proveedor actualizado correctamente';
          this.limpiarFormulario();
          this.listarProveedores();
        },
        error: (err) => {
          this.error = err.error || 'Error al actualizar proveedor';
        },
      });
    } else {
      this.proveedorService.guardar(this.proveedor).subscribe({
        next: () => {
          this.mensaje = 'Proveedor registrado correctamente';
          this.limpiarFormulario();
          this.listarProveedores();
        },
        error: (err) => {
          this.error = err.error || 'Error al registrar proveedor';
        },
      });
    }
  }

  editarProveedor(proveedor: Proveedor): void {
    this.editando = true;
    this.proveedorIdEditando = proveedor.id;

    this.proveedor = {
      ruc: proveedor.ruc,
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
    };
  }

  eliminarProveedor(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este proveedor?');

    if (!confirmar) return;

    this.proveedorService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Proveedor eliminado correctamente';
        this.listarProveedores();
      },
      error: () => {
        this.error = 'Error al eliminar proveedor';
      },
    });
  }

  limpiarFormulario(): void {
    this.proveedor = {
      ruc: '',
      nombre: '',
      telefono: '',
      direccion: '',
    };

    this.editando = false;
    this.proveedorIdEditando = undefined;
  }
}
