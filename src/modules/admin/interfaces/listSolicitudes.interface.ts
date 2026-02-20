export interface ISolicitudDb {
  idsolicitud: number;

  idtipodocumento: number;
  nrodocumento: string;

  nombres: string;
  apellidos: string;

  celular: number;
  correo: string;

  fechacelebracion: string; // YYYY-MM-DD
  fechamisadeseada: string; // YYYY-MM-DD
  fechasolicitud: string;   // YYYY-MM-DD

  idtipomisa: number;
  idhorario: number;

  intencion: string;
  voucherpago: string;

  montototal: number;

  estado: boolean;

  idusuariocreacion?: number | null;
  idusuariomodificacion?: number | null;

  fechacreacion: string;     // ISO datetime
  fechamodificacion: string; // ISO datetime

  idEstadoProceso: number;
}
