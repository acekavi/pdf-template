import { Routes } from '@angular/router';

export const routes: Routes = [ 
  {
    path: '',
    redirectTo: 'pdf-export',
    pathMatch: 'full',
  },
  {
    path: 'pdf-export',
    loadComponent: () => import('./pdf-export/pdf-export.page').then( m => m.PdfExportPage)
  },
];
