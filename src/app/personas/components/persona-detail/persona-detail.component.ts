import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona.model';

@Component({
  selector: 'app-persona-detail',
  imports: [RouterLink],
  templateUrl: './persona-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonaDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(PersonaService);

  protected persona: Persona | null = null;
  protected loading = true;
  protected notFound = false;

  ngOnInit(): void {
    const docIdentidad = this.route.snapshot.paramMap.get('docIdentidad')!;
    this.service.getPersona(docIdentidad).subscribe({
      next: (p) => {
        this.persona = p;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.notFound = true;
        } else {
          this.router.navigate(['/personas']);
        }
      },
    });
  }

  onDelete(): void {
    if (!this.persona || !confirm(`Delete persona ${this.persona.docIdentidad}?`)) return;
    this.service.deletePersona(this.persona.docIdentidad).subscribe({
      next: () => this.router.navigate(['/personas']),
      error: () => alert('Failed to delete persona'),
    });
  }
}
