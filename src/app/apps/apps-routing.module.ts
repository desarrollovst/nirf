import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentaComponent } from './cuenta/cuenta.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { AuthGuard } from '../autenticacion/auth.guard';

const routes: Routes = [
    {
        path: 'cuenta',
        component: CuentaComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Cuenta',
            headerDisplay: "none"
        }
    },
    {
        path: 'solicitud',
        component: SolicitudComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Solicitudes',
            headerDisplay: "none"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppsRoutingModule { }