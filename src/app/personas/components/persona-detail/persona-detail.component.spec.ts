import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { PersonaDetailComponent } from './persona-detail.component';
import { PersonaService } from '../../services/persona.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PersonaDetailComponent', () => {
  let fixture: ComponentFixture<PersonaDetailComponent>;
  let mockService: { getPersona: any; deletePersona: any };

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = { getPersona: vi.fn(), deletePersona: vi.fn() };
  });

  function createComponent(docIdentidad: string) {
    TestBed.configureTestingModule({
      imports: [PersonaDetailComponent],
      providers: [
        { provide: PersonaService, useValue: mockService },
        provideRouter([{ path: 'personas/:docIdentidad', component: PersonaDetailComponent }]),
      ],
    });

    fixture = TestBed.createComponent(PersonaDetailComponent);
    fixture.detectChanges();
  }

  it('shows persona details', () => {
    mockService.getPersona.mockReturnValue(of({ docIdentidad: '1', nombre: 'Alice', apellido: 'Smith', edad: 30, email: 'alice@test.com' }));
    createComponent('1');

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Alice');
    expect(text).toContain('Smith');
    expect(text).toContain('alice@test.com');
  });

  it('shows not-found on 404', () => {
    mockService.getPersona.mockReturnValue(throwError(() => ({ status: 404 })));
    createComponent('999');

    expect(fixture.nativeElement.textContent).toContain('not found');
  });

  it('calls delete and navigates', () => {
    mockService.getPersona.mockReturnValue(of({ docIdentidad: '1', nombre: 'A', apellido: 'B', edad: 25, email: 'a@b.com' }));
    mockService.deletePersona.mockReturnValue(of(void 0));
    createComponent('1');

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.componentInstance.onDelete();

    expect(mockService.deletePersona).toHaveBeenCalledWith('1');
  });
});
