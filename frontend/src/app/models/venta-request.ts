export interface DetalleRequest {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  clienteId: number;
  empleadoId: number;
  detalles: DetalleRequest[];
}
