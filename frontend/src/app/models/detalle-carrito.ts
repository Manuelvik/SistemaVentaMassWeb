import { Producto } from './producto';

export interface DetalleCarrito {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
