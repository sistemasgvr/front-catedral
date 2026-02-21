export interface INoticia {
  idnoticia: number;
  titulo: string;
  contenido: string;
  imagen: string | null;
  fecha_publicacion: string;
  fecha_evento: string | null;
  destacada: boolean;
  estado: boolean;
  idusuariocreacion: number | null;
  idusuariomodificacion: number | null;
  fechacreacion: string;
  fechamodificacion: string | null;
}

export interface INoticiaResumen {
  idnoticia: number;
  titulo: string;
  contenido: string;
  imagen: string | null;
  fecha_publicacion: string;
  fecha_evento: string | null;
  destacada: boolean;
}