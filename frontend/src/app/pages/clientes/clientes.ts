import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { ClienteService } from '../../services/cliente';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];

  cliente: Cliente = {
    dni: '',
    nombre: '',
    telefono: '',
    direccion: '',
  };

  editando: boolean = false;
  clienteIdEditando?: number;

  mensaje: string = '';
  error: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: () => {
        this.error = 'Error al listar clientes';
      },
    });
  }

  guardarCliente(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.cliente.dni || !this.cliente.nombre) {
      this.error = 'DNI y nombre son obligatorios';
      return;
    }

    if (this.editando && this.clienteIdEditando) {
      this.clienteService.actualizar(this.clienteIdEditando, this.cliente).subscribe({
        next: () => {
          this.mensaje = 'Cliente actualizado correctamente';
          this.limpiarFormulario();
          this.listarClientes();
        },
        error: (err) => {
          this.error = err.error || 'Error al actualizar cliente';
        },
      });
    } else {
      this.clienteService.guardar(this.cliente).subscribe({
        next: () => {
          this.mensaje = 'Cliente registrado correctamente';
          this.limpiarFormulario();
          this.listarClientes();
        },
        error: (err) => {
          this.error = err.error || 'Error al registrar cliente';
        },
      });
    }
  }

  editarCliente(cliente: Cliente): void {
    this.editando = true;
    this.clienteIdEditando = cliente.id;

    this.cliente = {
      dni: cliente.dni,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    };
  }

  eliminarCliente(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este cliente?');

    if (!confirmar) return;

    this.clienteService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Cliente eliminado correctamente';
        this.listarClientes();
      },
      error: () => {
        this.error = 'Error al eliminar cliente';
      },
    });
  }

  limpiarFormulario(): void {
    this.cliente = {
      dni: '',
      nombre: '',
      telefono: '',
      direccion: '',
    };

    this.editando = false;
    this.clienteIdEditando = undefined;
  }
}
