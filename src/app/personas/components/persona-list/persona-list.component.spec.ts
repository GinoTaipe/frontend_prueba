import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { PersonaListComponent } from './persona-list.component';
import { PersonaService } from '../../services/persona.service';
import { provideRouter } from '@angular/router';
import { signal, type WritableSignal } from '@angular/core';
import type { Persona } from '../../models/persona.model';

describe('PersonaListComponent', () => {
  let fixture: ComponentFixture<PersonaListComponent>;
  let mockService: Partial<PersonaService>;

  const mockPersonas: Persona[] = [
    { docIdentidad: '1', nombre: 'Alice', apellido: 'Smith', edad: 30, email: 'alice@test.com' },
    { docIdentidad: '2', nombre: 'Bob', apellido: 'Jones', edad: 25, email: 'bob@test.com' },
  ];

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = {
      personas: signal([]) as WritableSignal<Persona[]>,
      loading: signal(false) as WritableSignal<boolean>,
      error: signal(null) as WritableSignal<string | null>,
      getPersonas: vi.fn(),
      deletePersona: vi.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [PersonaListComponent],
      providers: [
        { provide: PersonaService, useValue: mockService },
        provideRouter([{ path: 'personas', component: PersonaListComponent }]),
      ],
    });

    fixture = TestBed.createComponent(PersonaListComponent);
  });

  it('calls getPersonas on init', () => {
    fixture.detectChanges();
    expect(mockService.getPersonas).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    (mockService as any).loading = signal(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading');
  });

  it('shows error state', () => {
    (mockService as any).error = signal('Server error');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Server error');
  });

  it('shows empty state when no personas', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No personas found');
  });

  it('renders persona rows', () => {
    (mockService as any).personas = signal(mockPersonas);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Alice');
    expect(text).toContain('Bob');
    expect(text).toContain('alice@test.com');
  });
});
