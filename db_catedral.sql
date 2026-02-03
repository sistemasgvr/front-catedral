-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.authusuarios (
  idusuarios integer NOT NULL DEFAULT nextval('authusuarios_idusuarios_seq'::regclass),
  nombre character varying NOT NULL,
  correo character varying NOT NULL UNIQUE,
  estado boolean DEFAULT true,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  contrasena_hash text,
  CONSTRAINT authusuarios_pkey PRIMARY KEY (idusuarios)
);
CREATE TABLE public.listas (
  idlista integer NOT NULL DEFAULT nextval('listas_idlista_seq'::regclass),
  nombre character varying NOT NULL,
  descripcion character varying,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  CONSTRAINT listas_pkey PRIMARY KEY (idlista),
  CONSTRAINT listas_idusuariocreacion_fkey FOREIGN KEY (idusuariocreacion) REFERENCES public.authusuarios(idusuarios),
  CONSTRAINT listas_idusuariomodificacion_fkey FOREIGN KEY (idusuariomodificacion) REFERENCES public.authusuarios(idusuarios)
);
CREATE TABLE public.menciones (
  idmencion integer NOT NULL DEFAULT nextval('menciones_idmencion_seq'::regclass),
  idsolicitud integer NOT NULL,
  descripcion character varying,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  CONSTRAINT menciones_pkey PRIMARY KEY (idmencion),
  CONSTRAINT menciones_idsolicitud_fkey FOREIGN KEY (idsolicitud) REFERENCES public.solicitudes(idsolicitud),
  CONSTRAINT menciones_idusuariocreacion_fkey FOREIGN KEY (idusuariocreacion) REFERENCES public.authusuarios(idusuarios),
  CONSTRAINT menciones_idusuariomodificacion_fkey FOREIGN KEY (idusuariomodificacion) REFERENCES public.authusuarios(idusuarios)
);
CREATE TABLE public.mencionesmisa (
  idmencionmisa integer NOT NULL DEFAULT nextval('mencionesmisa_idmencionmisa_seq'::regclass),
  idmencion integer NOT NULL,
  idmisa integer NOT NULL,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  CONSTRAINT mencionesmisa_pkey PRIMARY KEY (idmencionmisa),
  CONSTRAINT mencionesmisa_idmencion_fkey FOREIGN KEY (idmencion) REFERENCES public.menciones(idmencion),
  CONSTRAINT mencionesmisa_idmisa_fkey FOREIGN KEY (idmisa) REFERENCES public.misas(idmisa),
  CONSTRAINT mencionesmisa_idusuariocreacion_fkey FOREIGN KEY (idusuariocreacion) REFERENCES public.authusuarios(idusuarios),
  CONSTRAINT mencionesmisa_idusuariomodificacion_fkey FOREIGN KEY (idusuariomodificacion) REFERENCES public.authusuarios(idusuarios)
);
CREATE TABLE public.misas (
  idmisa integer NOT NULL DEFAULT nextval('misas_idmisa_seq'::regclass),
  idtipomisa integer NOT NULL,
  titulo character varying,
  fechacelebracion date NOT NULL,
  horainicio time without time zone NOT NULL,
  horafin time without time zone NOT NULL,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  CONSTRAINT misas_pkey PRIMARY KEY (idmisa),
  CONSTRAINT misas_idtipomisa_fkey FOREIGN KEY (idtipomisa) REFERENCES public.tipomisa(idtipomisa),
  CONSTRAINT misas_idusuariocreacion_fkey FOREIGN KEY (idusuariocreacion) REFERENCES public.authusuarios(idusuarios),
  CONSTRAINT misas_idusuariomodificacion_fkey FOREIGN KEY (idusuariomodificacion) REFERENCES public.authusuarios(idusuarios)
);
CREATE TABLE public.opcioneslista (
  idopcionlista integer NOT NULL DEFAULT nextval('opcioneslista_idopcionlista_seq'::regclass),
  idlista integer NOT NULL,
  nombre character varying NOT NULL,
  descripcion character varying,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  CONSTRAINT opcioneslista_pkey PRIMARY KEY (idopcionlista),
  CONSTRAINT opcioneslista_idlista_fkey FOREIGN KEY (idlista) REFERENCES public.listas(idlista),
  CONSTRAINT opcioneslista_idusuariocreacion_fkey FOREIGN KEY (idusuariocreacion) REFERENCES public.authusuarios(idusuarios),
  CONSTRAINT opcioneslista_idusuariomodificacion_fkey FOREIGN KEY (idusuariomodificacion) REFERENCES public.authusuarios(idusuarios)
);
CREATE TABLE public.solicitudes (
  idsolicitud integer NOT NULL DEFAULT nextval('solicitudes_idsolicitud_seq'::regclass),
  idtipodocumento integer NOT NULL,
  nrodocumento character varying NOT NULL,
  nombres character varying NOT NULL,
  apellidos character varying NOT NULL,
  celular integer,
  correo character varying,
  fechacelebracion date,
  idtipomisa integer,
  idhorario integer,
  intencion character varying,
  voucherpago character varying,
  fechasolicitud date DEFAULT CURRENT_DATE,
  montototal numeric,
  fechamisadeseada date,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  CONSTRAINT solicitudes_pkey PRIMARY KEY (idsolicitud),
  CONSTRAINT solicitudes_idtipodocumento_fkey FOREIGN KEY (idtipodocumento) REFERENCES public.opcioneslista(idopcionlista),
  CONSTRAINT solicitudes_idtipomisa_fkey FOREIGN KEY (idtipomisa) REFERENCES public.tipomisa(idtipomisa),
  CONSTRAINT solicitudes_idhorario_fkey FOREIGN KEY (idhorario) REFERENCES public.opcioneslista(idopcionlista),
  CONSTRAINT solicitudes_idusuariocreacion_fkey FOREIGN KEY (idusuariocreacion) REFERENCES public.authusuarios(idusuarios),
  CONSTRAINT solicitudes_idusuariomodificacion_fkey FOREIGN KEY (idusuariomodificacion) REFERENCES public.authusuarios(idusuarios)
);
CREATE TABLE public.tipomisa (
  idtipomisa integer NOT NULL DEFAULT nextval('tipomisa_idtipomisa_seq'::regclass),
  nombre character varying NOT NULL,
  estado boolean DEFAULT true,
  precio numeric NOT NULL,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamp with time zone DEFAULT now(),
  fechamodificacion timestamp with time zone,
  CONSTRAINT tipomisa_pkey PRIMARY KEY (idtipomisa),
  CONSTRAINT tipomisa_idusuariocreacion_fkey FOREIGN KEY (idusuariocreacion) REFERENCES public.authusuarios(idusuarios),
  CONSTRAINT tipomisa_idusuariomodificacion_fkey FOREIGN KEY (idusuariomodificacion) REFERENCES public.authusuarios(idusuarios)
);