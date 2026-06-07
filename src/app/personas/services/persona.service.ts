import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona, PersonaCreate, PersonaUpdate } from '../models/persona.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private readonly baseUrl = `${environment.apiUrl}/personas`;
  private readonly _personas = signal<Persona[]>([]);
  private readonly _error = signal<string | null>(null);
  private readonly _loading = signal(false);

  readonly personas = this._personas.asReadonly();
  readonly error = this._error.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor(private readonly http: HttpClient) {}

  getPersonas(): void {
    this._loading.set(true);
    this._error.set(null);
    this.http.get<Persona[]>(this.baseUrl).subscribe({
      next: (data) => {
        this._personas.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Error loading personas');
        this._loading.set(false);
      },
    });
  }

  getPersona(docIdentidad: string) {
    return this.http.get<Persona>(`${this.baseUrl}/${encodeURIComponent(docIdentidad)}`);
  }

  createPersona(data: PersonaCreate) {
    return this.http.post<Persona>(this.baseUrl, data);
  }

  updatePersona(docIdentidad: string, data: PersonaUpdate) {
    return this.http.put<Persona>(`${this.baseUrl}/${encodeURIComponent(docIdentidad)}`, data);
  }

  deletePersona(docIdentidad: string) {
    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(docIdentidad)}`);
  }
}
