import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-persona-list',
  imports: [RouterLink],
  templateUrl: './persona-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonaListComponent implements OnInit {
  protected readonly service = inject(PersonaService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.service.getPersonas();
  }

  navigateTo(docIdentidad: string): void {
    this.router.navigate(['/personas', docIdentidad]);
  }

  confirmDelete(docIdentidad: string): void {
    if (confirm(`Delete persona ${docIdentidad}?`)) {
      this.service.deletePersona(docIdentidad).subscribe({
        next: () => this.service.getPersonas(),
        error: () => alert('Failed to delete persona'),
      });
    }
  }
}
