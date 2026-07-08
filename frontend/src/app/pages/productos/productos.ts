import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { ProductoService } from '../../services/producto';
import { ProveedorService } from '../../services/proveedor';
import { Producto } from '../../models/producto';
import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];

  producto: Producto = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    proveedor: undefined,
  };

  proveedorIdSeleccionado: number | null = null;

  editando: boolean = false;
  productoIdEditando?: number;

  mensaje: string = '';
  error: string = '';

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
  ) {}

  ngOnInit(): void {
    this.listarProductos();
    this.listarProveedores();
  }

  listarProductos(): void {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: () => {
        this.error = 'Error al listar productos';
      },
    });
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

  guardarProducto(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.producto.codigo || !this.producto.nombre || this.producto.precio <= 0) {
      this.error = 'Código, nombre y precio son obligatorios';
      return;
    }

    if (this.producto.stock < 0) {
      this.error = 'El stock no puede ser negativo';
      return;
    }

    if (this.proveedorIdSeleccionado) {
      this.producto.proveedor = {
        id: this.proveedorIdSeleccionado,
        ruc: '',
        nombre: '',
        telefono: '',
        direccion: '',
      };
    } else {
      this.producto.proveedor = undefined;
    }

    if (this.editando && this.productoIdEditando) {
      this.productoService.actualizar(this.productoIdEditando, this.producto).subscribe({
        next: () => {
          this.mensaje = 'Producto actualizado correctamente';
          this.limpiarFormulario();
          this.listarProductos();
        },
        error: (err) => {
          this.error = err.error || 'Error al actualizar producto';
        },
      });
    } else {
      this.productoService.guardar(this.producto).subscribe({
        next: () => {
          this.mensaje = 'Producto registrado correctamente';
          this.limpiarFormulario();
          this.listarProductos();
        },
        error: (err) => {
          this.error = err.error || 'Error al registrar producto';
        },
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.editando = true;
    this.productoIdEditando = producto.id;

    this.producto = {
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      proveedor: producto.proveedor,
    };

    this.proveedorIdSeleccionado = producto.proveedor?.id || null;
  }

  eliminarProducto(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este producto?');

    if (!confirmar) return;

    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado correctamente';
        this.listarProductos();
      },
      error: () => {
        this.error = 'Error al eliminar producto';
      },
    });
  }

  limpiarFormulario(): void {
    this.producto = {
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: '',
      proveedor: undefined,
    };

    this.proveedorIdSeleccionado = null;
    this.editando = false;
    this.productoIdEditando = undefined;
  }
}
