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

export interface IMisaDetalle extends IMisa {
  tipomisa: {
    idtipomisa: number;
    nombre: string;
    precio: number;
  };
  menciones?: Array<{
    idmencion: number;
    descripcion: string;
    solicitud: {
      nombres: string;
      apellidos: string;
      intencion: string | null;
    };
  }>;
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