export interface Proveedor {
  id?: number;
  ruc: string;
  nombre: string;
  telefono: string;
  direccion: string;
  activo?: boolean;
}
