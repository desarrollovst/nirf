import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AutenticacionRoutingModule } from './autenticacion-routing.module';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { LoginComponent } from './login/login.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { RestauracionPasswordComponent } from './restauracion-password/restauracion-password.component';
import { RegistroComponent } from './registro/registro.component';
import { MensajeRegistroComponent } from './mensaje-registro/mensaje-registro.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { Error1Component } from './error-1/error-1.component';
import { Error2Component } from './error-2/error-2.component';
import { TemplateModule } from "src/app/shared/template/template.module";

const antdModule= [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzMessageModule,
    NzSpinModule,
    NzModalModule,
]

@NgModule({
    imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AutenticacionRoutingModule,
    ...antdModule,
    TemplateModule
],
    declarations: [
        LoginComponent,
        RecuperacionComponent,
        RestauracionPasswordComponent,
        RegistroComponent,
        MensajeRegistroComponent,
        ConfirmacionComponent,
        Error1Component,
        Error2Component
    ]
})

export class AutenticacionModule {}