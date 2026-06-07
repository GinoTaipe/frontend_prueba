export interface Persona {
  docIdentidad: string;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
}

export interface PersonaCreate {
  docIdentidad: string;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
}

export interface PersonaUpdate {
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
}
