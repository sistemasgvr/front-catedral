export interface IOpcionListaRef {
  idopcionlista: number;
  nombre: string;
  descripcion?: string | null;
}

export interface ITipoMisaRef {
  nombre: string;
  precio: number;
}

export interface IMencionDb {
  idmencion: number;
  descripcion: string | null;
  estado: boolean | null;
  fechacreacion?: string | null;
}

export interface ISolicitudDb {
  idsolicitud: number;
  idtipodocumento: number;
  nrodocumento: string;
  nombres: string;
  apellidos: string;
  celular: number | null;
  correo: string | null;
  fechacelebracion: string | null;
  idtipomisa: number | null;
  idhorario: number | null;
  intencion: string | null;
  voucherpago: string | null;
  fechasolicitud: string | null;
  montototal: number | null;
  fechamisadeseada: string | null;
  estado: boolean | null;
  idusuariocreacion: number | null;
  idusuariomodificacion: number | null;
  fechacreacion: string | null;
  fechamodificacion: string | null;
  idEstadoProceso?: number | null;
  tipomisa?: ITipoMisaRef | null;
  tipo_documento?: IOpcionListaRef | null;
  horario?: IOpcionListaRef | null;
  estado_proceso?: IOpcionListaRef | null;
  menciones?: IMencionDb[];
}
