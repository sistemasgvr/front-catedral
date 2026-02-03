export interface IMisa {
  idmisa: number;
  idtipomisa: number;
  titulo: string;
  fechacelebracion: string;
  horainicio: string;
  horafin: string;
  estado: boolean;
  idusuariocreacion: number;
  idusuariomodificacion: number | null;
  fechacreacion: string;
  fechamodificacion: string | null;
  tipomisa: ITipoMisaInfo;
  usuario_creador: IUsuarioCreador;
}

export interface ITipoMisaInfo {
  nombre: string;
  precio: number;
}

export interface IUsuarioCreador {
  correo: string;
  nombre: string;
}

// Para mostrar en el listado de misas
export interface IMisaListItem {
  id: number;
  titulo: string;
  fecha: string;
  horario: string;
  horainicio?: string;
  tipoMisa: string;
  precio: number;
}

// Mapear de IMisa a IMisaListItem
export const mapMisaToListItem = (misa: IMisa): IMisaListItem => ({
  id: misa.idmisa,
  titulo: misa.titulo,
  fecha: misa.fechacelebracion,
  horario: `${misa.horainicio} - ${misa.horafin}`,
  horainicio: misa.horainicio,
  tipoMisa: misa.tipomisa.nombre,
  precio: misa.tipomisa.precio,
});
