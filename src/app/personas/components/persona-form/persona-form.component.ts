import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-persona-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './persona-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PersonaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group({
    docIdentidad: ['', Validators.required],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: [0, [Validators.required, Validators.min(1)]],
    email: ['', [Validators.required, Validators.email]],
  });

  protected isEdit = false;
  protected submitting = false;
  protected backendError: string | null = null;

  private editId: string | null = null;

  ngOnInit(): void {
    const docIdentidad = this.route.snapshot.paramMap.get('docIdentidad');
    if (docIdentidad) {
      this.isEdit = true;
      this.editId = docIdentidad;
      this.service.getPersona(docIdentidad).subscribe({
        next: (p) => this.form.patchValue(p),
        error: () => this.router.navigate(['/personas']),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.backendError = null;

    const { docIdentidad, nombre, apellido, edad, email } = this.form.getRawValue();

    if (this.isEdit && this.editId) {
      this.service.updatePersona(this.editId, { nombre: nombre!, apellido: apellido!, edad: edad!, email: email! }).subscribe({
        next: () => this.router.navigate(['/personas', this.editId]),
        error: (err) => this.handleError(err),
      });
    } else {
      this.service.createPersona({ docIdentidad: docIdentidad!, nombre: nombre!, apellido: apellido!, edad: edad!, email: email! }).subscribe({
        next: () => this.router.navigate(['/personas']),
        error: (err) => this.handleError(err),
      });
    }
  }

  private handleError(err: any): void {
    this.submitting = false;
    if (err.status === 409) {
      this.backendError = 'A persona with this Document ID already exists.';
    } else {
      this.backendError = err.error?.detail ?? 'An unexpected error occurred.';
    }
  }
}
