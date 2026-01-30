export interface MisaMencion {
    idmisa: number
    titulo: string
    fechacelebracion: string
    menciones: Mencione[]
  }
  
  export interface Mencione {
    mencion: Mencion
  }
  
  export interface Mencion {
    descripcion: string
    solicitante: Solicitante
  }
  
  export interface Solicitante {
    nombres: string
    apellidos: string
    nrodocumento: string
  }
  