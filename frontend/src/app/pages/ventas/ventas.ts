import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';

import { ClienteService } from '../../services/cliente';
import { ProductoService } from '../../services/producto';
import { VentaService } from '../../services/venta';

import { Cliente } from '../../models/cliente';
import { Producto } from '../../models/producto';
import { DetalleCarrito } from '../../models/detalle-carrito';
import { VentaRequest } from '../../models/venta-request';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas implements OnInit {
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  ventas: any[] = [];

  clienteIdSeleccionado: number | null = null;
  productoIdSeleccionado: number | null = null;
  cantidad: number = 1;

  carrito: DetalleCarrito[] = [];

  mensaje: string = '';
  error: string = '';

  constructor(
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private ventaService: VentaService,
  ) {}

  ngOnInit(): void {
    this.listarClientes();
    this.listarProductos();
    this.listarVentas();
  }

  listarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (data) => (this.clientes = data),
      error: () => (this.error = 'Error al cargar clientes'),
    });
  }

  listarProductos(): void {
    this.productoService.listar().subscribe({
      next: (data) => (this.productos = data),
      error: () => (this.error = 'Error al cargar productos'),
    });
  }

  listarVentas(): void {
    this.ventaService.listar().subscribe({
      next: (data) => (this.ventas = data),
      error: () => (this.error = 'Error al cargar ventas'),
    });
  }

  agregarProducto(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.productoIdSeleccionado) {
      this.error = 'Seleccione un producto';
      return;
    }

    if (!this.cantidad || this.cantidad <= 0) {
      this.error = 'Ingrese una cantidad válida';
      return;
    }

    const producto = this.productos.find((p) => p.id === this.productoIdSeleccionado);

    if (!producto) {
      this.error = 'Producto no encontrado';
      return;
    }

    if (producto.stock < this.cantidad) {
      this.error = 'Stock insuficiente';
      return;
    }

    const productoExistente = this.carrito.find((item) => item.producto.id === producto.id);

    if (productoExistente) {
      const nuevaCantidad = productoExistente.cantidad + this.cantidad;

      if (producto.stock < nuevaCantidad) {
        this.error = 'Stock insuficiente para agregar más unidades';
        return;
      }

      productoExistente.cantidad = nuevaCantidad;
      productoExistente.subtotal = productoExistente.precioUnitario * nuevaCantidad;
    } else {
      this.carrito.push({
        producto: producto,
        cantidad: this.cantidad,
        precioUnitario: producto.precio,
        subtotal: producto.precio * this.cantidad,
      });
    }

    this.productoIdSeleccionado = null;
    this.cantidad = 1;
  }

  eliminarDetalle(index: number): void {
    this.carrito.splice(index, 1);
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  registrarVenta(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.clienteIdSeleccionado) {
      this.error = 'Seleccione un cliente';
      return;
    }

    if (this.carrito.length === 0) {
      this.error = 'Agregue productos a la venta';
      return;
    }

    const venta: VentaRequest = {
      clienteId: this.clienteIdSeleccionado,
      empleadoId: 1,
      detalles: this.carrito.map((item) => ({
        productoId: item.producto.id!,
        cantidad: item.cantidad,
      })),
    };

    this.ventaService.registrarVenta(venta).subscribe({
      next: () => {
        this.mensaje = 'Venta registrada correctamente';
        this.carrito = [];
        this.clienteIdSeleccionado = null;
        this.productoIdSeleccionado = null;
        this.cantidad = 1;
        this.listarProductos();
        this.listarVentas();
      },
      error: (err) => {
        this.error = err.error || 'Error al registrar venta';
      },
    });
  }
}
