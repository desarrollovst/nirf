import { Component } from '@angular/core'
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
    templateUrl: './restauracion-password.component.html',
    styleUrls: ['./restauracion-password.component.scss']
})

export class RestauracionPasswordComponent {
    restauracionForm: UntypedFormGroup;
    submitted: boolean;
    loading: boolean = true;
    valido: boolean = false;
    error: boolean = false;
    
    confirmationValidator = (control: UntypedFormControl): any => {
        if (!control.value) {
            return { required: true };
        }

        const password = this.restauracionForm?.get('password')?.value;

        if (control.value !== password) {
            return { passwordMismatch: true };
        }

        return null;
    }
    
    constructor(private router: Router, private route: ActivatedRoute
               ,private usuarioService: UsuarioService, private fb: UntypedFormBuilder
               ,private message: NzMessageService) {
    }

    get passwordValue(): string {
        return this.restauracionForm.get('password')?.value || '';
    }

    getPasswordStatus(): string {
        const control = this.restauracionForm.get('password');

        if (!control) return '';

        //no mostrar validacion mientras se escribe
        if (!this.submitted) {
            return '';
        }

        return control.invalid ? 'error' : 'success';
    }

    get hasNumber(): boolean {
        return /\d/.test(this.passwordValue);
    }

    get hasUpperCase(): boolean {
        return /[A-Z]/.test(this.passwordValue);
    }

    get hasLowerCase(): boolean {
        return /[a-z]/.test(this.passwordValue);
    }

    ngOnInit(): void {
        this.submitted = false;

        this.restauracionForm = this.fb.group({
            id_usuario       : [0],
            password         : [ null, [ Validators.required ] ],
            checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
        });

        const token = this.route.snapshot.queryParamMap.get('token');

        if (token) {
            this.usuarioService.procesarRecuperacion(token).subscribe({
                next: (res) => {
                    if(res.resultado !== 0){
                        this.valido = true;

                        this.restauracionForm.patchValue({
                            id_usuario: res.resultado
                        });

                        this.restauracionForm.get('password')?.valueChanges.subscribe(() => {
                            this.restauracionForm.get('checkPassword')?.updateValueAndValidity();
                        });
                    }
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

    updateConfirmValidator(): void {
        Promise.resolve().then(() =>
            this.restauracionForm.controls.checkPassword.updateValueAndValidity()
        );
    }

    submit(){
        if (this.restauracionForm.valid) {
            this.loading = true;

            const formData = new FormData();

            formData.append('id_usuario', this.restauracionForm.get('id_usuario')?.value ?? 0);
            formData.append('password', this.restauracionForm.get('password')?.value ?? 0);
            formData.append('operacion', "2");
            
            this.usuarioService.restaurarPassword(formData)
            .subscribe({
                next: (res) => {
                    if(res.estatus_code === 200){   
                        this.message.success(res.mensaje);
                        this.router.navigate(['/autenticacion/login']);
                    }
                    else{
                        this.message.error(res.mensaje);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error en registro', err);
                    this.loading = false;
                }
            });
        }
        else{
            Object.values(this.restauracionForm.controls).forEach(control => {
                control.markAsTouched();
                control.updateValueAndValidity();
            });
        }
    }
}   