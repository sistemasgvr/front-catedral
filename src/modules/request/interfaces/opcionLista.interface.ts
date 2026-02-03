export interface IOpcionLista {
  idopcionlista: number;
  nombre: string;
  descripcion?: string | null;
}

// Alias para compatibilidad con el componente InputSelect
export interface ISelectOption {
  id: number;
  nombre: string;
  descripcion?: string;
}

// Función para mapear IOpcionLista a ISelectOption
export const mapOpcionToSelect = (opcion: IOpcionLista): ISelectOption => ({
  id: opcion.idopcionlista,
  nombre: opcion.nombre,
  descripcion: opcion.descripcion,
});
