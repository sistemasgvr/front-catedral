export interface ISolicitud {
  // Datos del solicitante (Paso 1)
  idTipoDocumento: number | null;
  nroDocumento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  correo: string;

  // Datos de la celebración (Paso 2)
  fechaCelebracion: string;
  idTipoMisa: number | null;
  idHorario: number | null;
  intencion: string;

  // Menciones (Paso 3)
  menciones: IMencion[];

  // Flag para misa privada (salta menciones, solo costo privada)
  esMisaPrivada?: boolean;

  // Pago (Paso 4)
  voucherPago: string;
  montoTotal: number;

  // Datos adicionales (Paso 5 - Confirmación)
  fechaSolicitud: string;
  fechaMisaDeseada: string;
  estado: boolean;
  idUsuarioCreacion: number | null;
}

// Interface para menciones
export interface IMencion {
  id: number;
  descripcion: string;
  costo: number;
}

export interface ITipoDocumento {
  id: number;
  nombre: string;
}

export interface ITipoMisa {
  id: number;
  nombre: string;
  precio: number;
}

export interface IHorario {
  id: number;
  hora: string;
  descripcion: string;
}

// Costo por mención (estático por ahora)
export const COSTO_MENCION = 5;

// Estado inicial de la solicitud
export const solicitudInicial: ISolicitud = {
  idTipoDocumento: null,
  nroDocumento: '',
  nombres: '',
  apellidos: '',
  celular: '',
  correo: '',
  fechaCelebracion: '',
  idTipoMisa: null,
  idHorario: null,
  intencion: '',
  menciones: [],
  voucherPago: '',
  montoTotal: 0,
  fechaSolicitud: new Date().toISOString().split('T')[0] || '',
  fechaMisaDeseada: '',
  estado: true,
  idUsuarioCreacion: null,
};
