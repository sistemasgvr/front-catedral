export interface IMisa {
  idmisa: number;
  idtipomisa: number;
  titulo: string | null;
  fechacelebracion: string;
  horainicio: string;
  horafin: string;
  estado: boolean;
  idusuariocreacion: number | null;
  idusuariomodificacion: number | null;
  fechacreacion: string;
  fechamodificacion: string | null;
}

export interface IMisaConRelaciones extends IMisa {
  tipomisa?: {
    nombre: string;
    precio: number;
  };
  solicitud?: {
    nombres: string;
    apellidos: string;
    intencion: string | null;
  };
}

export interface IMencionMisa {
  idmencionmisa: number;
  mencion: {
    idmencion: number;
    descripcion: string | null;
    solicitud: {
      idsolicitud: number;
      idhorario?: number | null;
      idestadoproceso?: number;
      nombres: string;
      apellidos: string;
      celular: number | null;
      correo: string | null;
      nrodocumento: string;
      intencion: string | null;
    };
  };
}

export interface IMisaDetalle extends IMisa {
  tipomisa: {
    idtipomisa: number;
    nombre: string;
    precio: number;
  };
  menciones?: IMencionMisa[];
}

export interface ICrearMisaForm {
  idtipomisa: number;
  titulo: string;
  fechacelebracion: string;
  horainicio: string;
  horafin: string;
  estado: boolean;
}

export interface IEditarMisaForm extends ICrearMisaForm {
  idmisa: number;
}