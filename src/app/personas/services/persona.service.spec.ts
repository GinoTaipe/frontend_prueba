import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PersonaService } from './persona.service';
import { Persona } from '../models/persona.model';

describe('PersonaService', () => {
  let service: PersonaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PersonaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getPersonas fetches and sets personas signal', () => {
    const mock: Persona[] = [
      { docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' },
    ];

    service.getPersonas();
    const req = http.expectOne('/api/personas');
    req.flush(mock);

    expect(service.personas()).toEqual(mock);
    expect(service.loading()).toBe(false);
  });

  it('getPersonas sets error on failure', () => {
    service.getPersonas();
    const req = http.expectOne('/api/personas');
    req.error(new ProgressEvent('Network error'));

    expect(service.error()).toBeTruthy();
    expect(service.loading()).toBe(false);
  });

  it('getPersona returns a single persona', async () => {
    const mock: Persona = { docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' };

    const promise = firstValueFrom(service.getPersona('1'));
    const req = http.expectOne('/api/personas/1');
    req.flush(mock);

    await expect(promise).resolves.toEqual(mock);
  });

  it('createPersona sends POST', async () => {
    const data = { docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' };

    const promise = firstValueFrom(service.createPersona(data));
    const req = http.expectOne({ method: 'POST', url: '/api/personas' });
    expect(req.request.body).toEqual(data);
    req.flush(data);

    await expect(promise).resolves.toEqual(data);
  });

  it('updatePersona sends PUT', async () => {
    const data = { nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' };

    const promise = firstValueFrom(service.updatePersona('1', data));
    const req = http.expectOne({ method: 'PUT', url: '/api/personas/1' });
    expect(req.request.body).toEqual(data);
    req.flush({ ...data, docIdentidad: '1' });

    await expect(promise).resolves.toEqual({ ...data, docIdentidad: '1' });
  });

  it('deletePersona sends DELETE', async () => {
    const promise = firstValueFrom(service.deletePersona('1'));
    const req = http.expectOne({ method: 'DELETE', url: '/api/personas/1' });
    req.flush(null);

    await expect(promise).resolves.toBeNull();
  });
});
