import { Component } from '@angular/core'
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ConfigService } from 'src/app/shared/services/config.service';

@Component({
    templateUrl: './confirmacion.component.html'
})

export class ConfirmacionComponent {
    confirmacionForm: UntypedFormGroup;
    loading: boolean = true;
    valido: boolean = false;
    error: boolean = false;
    
    
    constructor(private router: Router, private route: ActivatedRoute
               ,private usuarioService: UsuarioService, private configService: ConfigService
               ,private fb: UntypedFormBuilder ,private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.confirmacionForm = this.fb.group({
            email: this.fb.control(null, {
                validators: [
                    Validators.required,
                    Validators.email
                ],
                updateOn: 'submit'
            })
        });

        const token = this.route.snapshot.queryParamMap.get('token');

        if (token) {
            this.usuarioService.procesarConfirmacion(token).subscribe({
                next: (res) => {
                    if(res.resultado !== 0)
                        this.valido = true;
                    else
                        this.error = true;
                    
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                    this.error = true;
                }
            });
        }
    }

    submit(){
        if(this.confirmacionForm.valid){
            this.loading = true;

            const formData = new FormData();

            formData.append('convenio', this.configService.settings.convenio.toString());
            formData.append('email', this.confirmacionForm.get('email')?.value);

            return this.usuarioService.reenviarConfirmacion(formData).subscribe({
                next: (res) => {
                    if(res.estatus_code ===  200 && res.resultado === 1){
                        this.message.success(res.mensaje);
                        this.router.navigate(['/autenticacion/login']);
                    }
                    else if(res.estatus_code ===  200 && res.resultado === 0){
                        this.message.error(res.mensaje);
                        this.router.navigate(['/autenticacion/login']);       
                    }
                    else if(res.estatus_code === 400)
                        this.message.error(res.mensaje);

                    this.loading = false;
                },
                error: (error) => {
                    this.message.error("Error en el proceso. Intente nuevamente");
                    this.loading = false;
                }
            });
        }
        else {
            for (const i in this.confirmacionForm.controls) {
                this.confirmacionForm.controls[i].markAsDirty();
                this.confirmacionForm.controls[i].updateValueAndValidity();
            }
        }
    }
}   