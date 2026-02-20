export interface IDetalleSolicitud {
  idsolicitud: number;
  idtipodocumento: number;
  nrodocumento: string;
  nombres: string;
  apellidos: string;
  celular: number;
  correo: string;
  fechacelebracion: string;
  idtipomisa: number;
  idhorario: number;
  intencion: string | null;
  voucherpago: string;
  fechasolicitud: string;
  montototal: number;
  fechamisadeseada: string;
  estado: boolean;
  idusuariocreacion: number | null;
  idusuariomodificacion: number | null;
  fechacreacion: string;
  fechamodificacion: string;
  idEstadoProceso: number | null;
}