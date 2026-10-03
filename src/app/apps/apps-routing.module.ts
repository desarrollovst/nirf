import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../autenticacion/auth.guard';
import { CuentaComponent } from './cuenta/cuenta.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { SimuladorComponent } from './simulador/simulador.component';
import { CreditoComponent } from './credito/credito.component';

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
    },
    {
        path: 'simulador',
        component: SimuladorComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Simulador de Crédito',
            headerDisplay: "none"
        }
    },
    {
        path: 'creditos',
        component: CreditoComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Créditos',
            headerDisplay: "none"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppsRoutingModule { }