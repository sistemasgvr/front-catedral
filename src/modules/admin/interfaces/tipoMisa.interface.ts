import type { ISelectOption } from "./opcionLista.interface";

export interface ITipoMisa {
    idtipomisa: number;
    nombre: string;
    estado: boolean;
    precio: number;
    idusuariocreacion: number;
    idusuariomodificacion?: number;
    fechacreacion: string;
    fechamodificacion: string;
}

// Función para mapear ITipoMisa a ISelectOption
export const mapTipoMisaToSelect = (tipoMisa: ITipoMisa): ISelectOption => ({
  id: tipoMisa.idtipomisa,
  nombre: tipoMisa.nombre,
  descripcion: `S/ ${tipoMisa.precio.toFixed(2)}`, // Opcional: mostrar precio en descripción
});