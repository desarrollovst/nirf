import { Component, TemplateRef, ViewChild } from '@angular/core'
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConfigService } from 'src/app/shared/services/config.service';
import { UsuarioService } from '../../shared/services/usuario.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.scss']
})

export class RegistroComponent {
    @ViewChild('avisoPrivacidadModal', { static: true })
    avisoPrivacidadModal!: TemplateRef<any>;
    signUpForm: UntypedFormGroup;
    submitted: boolean;
    loading: boolean = false;
    pdfUrl!: SafeResourceUrl;
    agreeEnabled: boolean = false;

    abrirAvisoPrivacidad(event: Event): void {
        event.preventDefault();

        const modal = this.modal.create({
            nzTitle: 'Aviso de Privacidad',
            nzContent: this.avisoPrivacidadModal,
            nzWidth: '80%',
            nzCancelText: null,
            nzOnOk: () => {
                this.agreeEnabled = true;
                this.signUpForm.get('agree')?.setValue(true);
            }
        });
    }

    constructor(private fb: UntypedFormBuilder, private router: Router, 
                private message: NzMessageService, private configService: ConfigService,
                private usuarioService: UsuarioService, private modal: NzModalService,
                private sanitizer: DomSanitizer) {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            './assets/pdf/aviso_privacidad.pdf'
        );
    }

    get passwordValue(): string {
        return this.signUpForm.get('password')?.value || '';
    }

    getPasswordStatus(): string {
        const control = this.signUpForm.get('password');

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

    submitForm(): void {
        this.submitted = true;

        const password = this.signUpForm.get('password');
        const value = password?.value || '';

        const errors: any = {};

        if (!value) {
            errors.required = true;
        }

        if (value.length < 8) {
            errors.minlength = true;
        }

        if (value.length > 16) {
            errors.maxlength = true;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            errors.pattern = true;
        }

        password?.setErrors(Object.keys(errors).length ? errors : null);

        if (this.signUpForm.invalid) {
            Object.values(this.signUpForm.controls).forEach(control => {
                control.markAsTouched();
                control.updateValueAndValidity();
            });
            return;
        }

        this.loading = true;
        const formData = new FormData();

        formData.append('id_usuario', "0");
        formData.append('id_convenio', this.configService.settings.id_convenio.toString());
        formData.append('convenio', this.configService.settings.convenio.toString());
        formData.append('email', this.signUpForm.get('email')?.value);
        formData.append('password', this.signUpForm.get('password')?.value);
        formData.append('operacion', "1");

        this.usuarioService.registrar(formData)
        .subscribe({
            next: (res) => {
                if(res.estatus_code === 200){
                    this.router.navigate(['/autenticacion/mensaje-registro']);        
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

    updateConfirmValidator(): void {
        Promise.resolve().then(() =>
            this.signUpForm.controls.checkPassword.updateValueAndValidity()
        );
    }

    confirmationValidator = (control: UntypedFormControl): any => {
        if (!control.value) {
            return { required: true };
        }

        const password = this.signUpForm?.get('password')?.value;

        if (control.value !== password) {
            return { passwordMismatch: true };
        }

        return null;
    }

    ngOnInit(): void {
        this.submitted = false;

        this.signUpForm = this.fb.group({
            email: this.fb.control(null, {
                validators: [
                    Validators.required,
                    Validators.email
                ],
                updateOn: 'submit'
            }),
            password         : [ null, [ Validators.required ] ],
            checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
            agree            : [ false, [Validators.requiredTrue] ]
        });

        this.signUpForm.get('password')?.valueChanges.subscribe(() => {
            this.signUpForm.get('checkPassword')?.updateValueAndValidity();
        });
    }
}    