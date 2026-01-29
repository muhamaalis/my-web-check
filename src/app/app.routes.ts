import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'check/new' },

  {
    path: 'check/new',
    loadComponent: () =>
      import('./features/check/pages/check-form/check-form').then(
        (m) => m.CheckFormComponent 
      ),
  },
  {
    path: 'check/list',
    loadComponent: () =>
      import('./features/check/pages/check-list/check-list').then(
        (m) => m.CheckListComponent
      ),
  },

  { path: '**', redirectTo: 'check/new' },
];
