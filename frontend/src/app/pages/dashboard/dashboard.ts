import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';

import { ClienteService } from '../../services/cliente';
import { ProductoService } from '../../services/producto';
import { ProveedorService } from '../../services/proveedor';
import { VentaService } from '../../services/venta';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalClientes: number = 0;
  totalProductos: number = 0;
  totalProveedores: number = 0;
  totalVentas: number = 0;

  constructor(
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private ventaService: VentaService,
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.clienteService.listar().subscribe({
      next: (data) => (this.totalClientes = data.length),
    });

    this.productoService.listar().subscribe({
      next: (data) => (this.totalProductos = data.length),
    });

    this.proveedorService.listar().subscribe({
      next: (data) => (this.totalProveedores = data.length),
    });

    this.ventaService.listar().subscribe({
      next: (data) => (this.totalVentas = data.length),
    });
  }
}
