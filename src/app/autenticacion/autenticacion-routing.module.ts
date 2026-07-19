import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { RestauracionPasswordComponent } from './restauracion-password/restauracion-password.component';
import { Error1Component } from './error-1/error-1.component';
import { Error2Component } from './error-2/error-2.component';
import { MensajeRegistroComponent } from './mensaje-registro/mensaje-registro.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';

const routes: Routes = [   
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login'
        }
    },
    {
        path: 'registro',
        component: RegistroComponent,
        data: {
            title: 'Registro'
        }
    },
    {
        path: 'mensaje-registro',
        component: MensajeRegistroComponent,
        data: {
            title: 'Mensaje Registro'
        }
    },
    {
        path: 'confirmacion',
        component: ConfirmacionComponent,
        data: {
            title: 'Confirmacion'
        }
    },
    {
        path: 'recuperacion',
        component: RecuperacionComponent,
        data: {
            title: 'Recuperación'
        }
    },
    {
        path: 'restauracion-password',
        component: RestauracionPasswordComponent,
        data: {
            title: 'Restauración Password'
        }
    },
    {
        path: 'error-1',
        component: Error1Component,
        data: {
            title: 'Error 1'
        }
    },
    {
        path: 'error-2',
        component: Error2Component,
        data: {
            title: 'Error 2'
        }
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AutenticacionRoutingModule { }
