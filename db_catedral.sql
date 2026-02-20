/* EJECUCION . CORREGIDO*/

ALTER DATABASE postgres SET timezone TO 'America/Lima';

CREATE TABLE public.authusuarios (
  idusuarios integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre varchar NOT NULL,
  correo varchar NOT NULL UNIQUE,
  estado boolean DEFAULT true,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  contrasena_hash text
);

CREATE TABLE public.listas (
  idlista integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre varchar NOT NULL,
  descripcion varchar,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  FOREIGN KEY (idusuariocreacion) REFERENCES authusuarios(idusuarios),
  FOREIGN KEY (idusuariomodificacion) REFERENCES authusuarios(idusuarios)
);

CREATE TABLE public.tipomisa (
  idtipomisa integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre varchar NOT NULL,
  precio numeric NOT NULL,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  FOREIGN KEY (idusuariocreacion) REFERENCES authusuarios(idusuarios),
  FOREIGN KEY (idusuariomodificacion) REFERENCES authusuarios(idusuarios)
);

CREATE TABLE public.opcioneslista (
  idopcionlista integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idlista integer NOT NULL,
  nombre varchar NOT NULL,
  descripcion varchar,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  FOREIGN KEY (idlista) REFERENCES listas(idlista),
  FOREIGN KEY (idusuariocreacion) REFERENCES authusuarios(idusuarios),
  FOREIGN KEY (idusuariomodificacion) REFERENCES authusuarios(idusuarios)
);

CREATE TABLE public.solicitudes (
  idsolicitud integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idtipodocumento integer NOT NULL,
  nrodocumento varchar NOT NULL,
  nombres varchar NOT NULL,
  apellidos varchar NOT NULL,
  celular integer,
  correo varchar,
  fechacelebracion date,
  idtipomisa integer,
  idhorario integer,
  intencion varchar,
  voucherpago varchar,
  fechasolicitud date DEFAULT CURRENT_DATE,
  montototal numeric,
  fechamisadeseada date,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  FOREIGN KEY (idtipodocumento) REFERENCES opcioneslista(idopcionlista),
  FOREIGN KEY (idtipomisa) REFERENCES tipomisa(idtipomisa),
  FOREIGN KEY (idhorario) REFERENCES opcioneslista(idopcionlista),
  FOREIGN KEY (idusuariocreacion) REFERENCES authusuarios(idusuarios),
  FOREIGN KEY (idusuariomodificacion) REFERENCES authusuarios(idusuarios)
);

CREATE TABLE public.menciones (
  idmencion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idsolicitud integer NOT NULL,
  descripcion varchar,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  FOREIGN KEY (idsolicitud) REFERENCES solicitudes(idsolicitud),
  FOREIGN KEY (idusuariocreacion) REFERENCES authusuarios(idusuarios),
  FOREIGN KEY (idusuariomodificacion) REFERENCES authusuarios(idusuarios)
);

CREATE TABLE public.misas (
  idmisa integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idtipomisa integer NOT NULL,
  titulo varchar,
  fechacelebracion date NOT NULL,
  horainicio time NOT NULL,
  horafin time NOT NULL,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  FOREIGN KEY (idtipomisa) REFERENCES tipomisa(idtipomisa),
  FOREIGN KEY (idusuariocreacion) REFERENCES authusuarios(idusuarios),
  FOREIGN KEY (idusuariomodificacion) REFERENCES authusuarios(idusuarios)
);

CREATE TABLE public.mencionesmisa (
  idmencionmisa integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idmencion integer NOT NULL,
  idmisa integer NOT NULL,
  estado boolean DEFAULT true,
  idusuariocreacion integer,
  idusuariomodificacion integer,
  fechacreacion timestamptz DEFAULT now(),
  fechamodificacion timestamptz,
  FOREIGN KEY (idmencion) REFERENCES menciones(idmencion),
  FOREIGN KEY (idmisa) REFERENCES misas(idmisa),
  FOREIGN KEY (idusuariocreacion) REFERENCES authusuarios(idusuarios),
  FOREIGN KEY (idusuariomodificacion) REFERENCES authusuarios(idusuarios)
);