import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { PersonaFormComponent } from './persona-form.component';
import { PersonaService } from '../../services/persona.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PersonaFormComponent', () => {
  let fixture: ComponentFixture<PersonaFormComponent>;
  let mockService: { createPersona: any; updatePersona: any; getPersona: any };

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = { createPersona: vi.fn(), updatePersona: vi.fn(), getPersona: vi.fn() };

    TestBed.configureTestingModule({
      imports: [PersonaFormComponent],
      providers: [
        { provide: PersonaService, useValue: mockService },
        provideRouter([{ path: 'personas', component: {} as any }]),
      ],
    });

    fixture = TestBed.createComponent(PersonaFormComponent);
    fixture.detectChanges();
  });

  it('renders the form', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('New Persona');
    expect(fixture.nativeElement.querySelector('input[id="docIdentidad"]')).toBeTruthy();
  });

  it('submits create request', () => {
    mockService.createPersona.mockReturnValue(of({ docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' }));

    const comp = fixture.componentInstance as any;
    comp.form.setValue({ docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' });
    comp.onSubmit();

    expect(mockService.createPersona).toHaveBeenCalledWith({
      docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com',
    });
  });

  it('shows backend error on 409', () => {
    mockService.createPersona.mockReturnValue(throwError(() => ({ status: 409, error: { detail: 'Conflict' } })));

    const comp = fixture.componentInstance as any;
    comp.form.setValue({ docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' });
    comp.onSubmit();

    expect(comp.backendError).toContain('already exists');
  });
});
