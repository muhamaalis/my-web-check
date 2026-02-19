import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home').then(
        (m) => m.HomeComponent
      ),
  },

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
  {
    path: 'check/detail/:id',
    loadComponent: () =>
      import('./features/check/pages/check-detail/check-detail').then(
        (m) => m.CheckDetailComponent
      ),
  },
  {
    path: 'asset/list',
    loadComponent: () =>
      import('./features/asset/pages/asset-list/asset-list').then(
        (m) => m.AssetListComponent
      ),
  },
  {
    path: 'asset/new',
    loadComponent: () =>
      import('./features/asset/pages/asset-form/asset-form').then(
        (m) => m.AssetFormComponent
      ),
  },
  {
    path: 'asset/edit/:id',
    loadComponent: () =>
      import('./features/asset/pages/asset-edit/asset-edit').then(
        (m) => m.AssetEditComponent
      ),
  },

  { path: '**', redirectTo: 'check/new' },
];
