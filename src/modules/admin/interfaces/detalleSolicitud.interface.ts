export interface ITipomisaDetalleEmbedded {
  idtipomisa: number;
  nombre: string;
  precio?: number;
}

export interface IMencionDetalle {
  idmencion: number;
  descripcion: string | null;
  estado?: boolean | null;
  fechacreacion?: string | null;
}

export interface IDetalleSolicitud {
  idsolicitud: number;
  idtipodocumento: number;
  nrodocumento: string;
  nombres: string;
  apellidos: string;
  /** Puede venir como número o string según el origen JSON. */
  celular: number | string | null;
  correo: string;
  fechacelebracion: string;
  idtipomisa: number | null;
  idhorario: number | null;
  intencion: string | null;
  voucherpago: string;
  fechasolicitud: string;
  montototal: number | null;
  fechamisadeseada: string;
  estado: boolean;
  idusuariocreacion: number | null;
  idusuariomodificacion: number | null;
  fechacreacion: string;
  fechamodificacion: string;
  idestadoproceso: number | null;
  /** select=tipomisa(...) */
  tipomisa?: ITipomisaDetalleEmbedded | ITipomisaDetalleEmbedded[] | null;
  /** select=menciones(...) */
  menciones?: IMencionDetalle[];
}