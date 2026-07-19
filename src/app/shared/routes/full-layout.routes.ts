import { Routes } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'autenticacion',
        loadChildren: () => import('../../autenticacion/autenticacion.module').then(m => m.AutenticacionModule)
    }
];