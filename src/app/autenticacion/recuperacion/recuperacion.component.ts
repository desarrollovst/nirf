import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ConfigService } from 'src/app/shared/services/config.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
    templateUrl: './recuperacion.component.html'
})

export class RecuperacionComponent {
    recuperacionForm: UntypedFormGroup;
    loading: boolean = false;
    
    constructor(private fb: UntypedFormBuilder, private router: Router 
               ,private message: NzMessageService, private usuarioService: UsuarioService
               ,private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.recuperacionForm = this.fb.group({
            email: this.fb.control(null, {
                validators: [
                    Validators.required,
                    Validators.email
                ],
                updateOn: 'submit'
            })
        });
    }

    submitForm(){
        if (this.recuperacionForm.valid) {
            this.loading = true;

            const formData = new FormData();

            formData.append('convenio', this.configService.settings.convenio.toString());
            formData.append('email', this.recuperacionForm.get('email')?.value);

            this.usuarioService.recuperarPassword(formData)
            .subscribe({
                next: (res) => {
                    if(res.resultado !== 0){
                        this.router.navigate(['/autenticacion/login']);
                        this.message.success(res.mensaje);
                        this.loading = false;
                    }
                    else{
                        this.message.error(res.mensaje);
                        this.loading = false;
                    }
                }
            });
        }
        else{
            Object.values(this.recuperacionForm.controls).forEach(control => {
                control.markAsTouched();
                control.updateValueAndValidity();
            });
        }
    }
}    