import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/personas', pathMatch: 'full' },
  {
    path: 'personas',
    loadComponent: () => import('./personas/components/persona-list/persona-list.component').then((m) => m.PersonaListComponent),
  },
  {
    path: 'personas/new',
    loadComponent: () => import('./personas/components/persona-form/persona-form.component').then((m) => m.PersonaFormComponent),
  },
  {
    path: 'personas/:docIdentidad',
    loadComponent: () => import('./personas/components/persona-detail/persona-detail.component').then((m) => m.PersonaDetailComponent),
  },
  {
    path: 'personas/:docIdentidad/edit',
    loadComponent: () => import('./personas/components/persona-form/persona-form.component').then((m) => m.PersonaFormComponent),
  },
];
