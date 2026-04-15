/** Relación embebida (select=tipomisa(...)) */
export interface ITipomisaEmbeddedList {
  idtipomisa: number;
  nombre: string;
}

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

  idtipomisa: number | null;
  idhorario: number | null;

  /** Incluido cuando el listado usa select=*,tipomisa(...) */
  tipomisa?: ITipomisaEmbeddedList | ITipomisaEmbeddedList[] | null;

  intencion: string;
  voucherpago: string;

  montototal: number | null;

  estado: boolean;

  idusuariocreacion?: number | null;
  idusuariomodificacion?: number | null;

  fechacreacion: string;     // ISO datetime
  fechamodificacion: string; // ISO datetime

  idestadoproceso: number;
}
