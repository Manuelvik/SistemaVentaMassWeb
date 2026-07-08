export interface Cliente {
  id?: number;
  dni: string;
  nombre: string;
  telefono: string;
  direccion: string;
  activo?: boolean;
}
