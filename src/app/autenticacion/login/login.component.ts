import { Component } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AutenticacionService } from '../../shared/services/autenticacion.service';

@Component({
    templateUrl: './login.component.html'
})

export class LoginComponent {
    loginForm: UntypedFormGroup;
    loading: boolean = false;

    submitForm(): void {
        if (this.loginForm.valid) {
            this.loading = true;

            const { email, password } = this.loginForm.value;    

            this.authService.login(email, password)
            .subscribe({
                next: (res) => {
                    this.loading = false;
                    if(res.id_usuario !== 0){
                        // redirigir al workspace
                        this.router.navigate(['/dashboard']);
                    }
                    else{
                        this.message.error(res.mensaje);
                    }
                },
                error: (err) => {
                    this.loading = false;
                    console.error('Error en registro', err);
                }
            });
        } else {
            for (const i in this.loginForm.controls) {
                this.loginForm.controls[i].markAsDirty();
                this.loginForm.controls[i].updateValueAndValidity();
            }
        }
    }

    constructor(private fb: UntypedFormBuilder, private router: Router
               ,private message: NzMessageService ,private authService: AutenticacionService) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: this.fb.control(null, {
                validators: [
                    Validators.required,
                    Validators.email
                ],
                updateOn: 'submit'
            }),
            password: [ null, [ Validators.required ] ]
        });
    }
}    