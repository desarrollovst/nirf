import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AutenticacionService } from '../../shared/services/autenticacion.service';
import { CatalogoService } from '../../shared/services/catalogo.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { CuentaService } from '../../shared/services/cuenta.service';
import { Entidad } from 'src/app/shared/interfaces/entidad.type';
import { Municipio } from 'src/app/shared/interfaces/municipio.type';
import { Localidad } from 'src/app/shared/interfaces/localidad.type';
import { Colonia } from 'src/app/shared/interfaces/colonia.type';
import { DateUtils } from '../../shared/utils/date.utils';

@Component({
    templateUrl: './cuenta.component.html'
})

export class CuentaComponent {
    avatarForm: UntypedFormGroup; 
    usuarioForm: UntypedFormGroup;
    passForm: UntypedFormGroup;
    datosGralsForm: UntypedFormGroup;
    domForm: UntypedFormGroup;
    loading: boolean = false;
    avatarUrl: string = "./assets/images/avatars/user.png";
    entidades: Entidad[] = [];
    municipios: Municipio[] = [];
    localidades: Localidad[] = [];
    colonias: Colonia[] = [];

    public actualizarPassword(){
        this.loading = true;

        const currentUser = this.authService.obtenerUsuarioActual();

        const formData = new FormData();

        formData.append('id_usuario', currentUser.id_usuario.toString());
        formData.append('password_anterior', this.passForm.get('oldPassword')?.value ?? 0);
        formData.append('password', this.passForm.get('newPassword')?.value ?? 0);
        formData.append('operacion', "1");
        
        this.usuarioService.actualizarPassword(formData)
        .subscribe({
            next: (res) => {
                this.loading = false;
                if(res.estatus_code === 200){   
                    this.notificacion.success('Usuario', res.mensaje);
                    this.passForm.reset();
                }
                else{
                    this.notificacion.error('Usuario', res.mensaje);
                }
            },
            error: (err) => {
                console.error('Error en registro', err);
                this.loading = false;
            }
        });
    }

    public cargarFormularios(){
        const currentUser = this.authService.obtenerUsuarioActual();

        //Consulta simultanea de informacion
        forkJoin({
            responseUsuario: this.usuarioService.obtenerAvatar(currentUser.id_usuario),
            responseDatos: this.cuentaService.obtenerDatos(currentUser.id_usuario),
            responseDom: this.cuentaService.obtenerDomicilio(currentUser.id_usuario)
        }).subscribe({
            next: ({ responseUsuario, responseDatos, responseDom }) => {
                this.usuarioForm.patchValue({
                    email: currentUser.email
                });    

                if(responseUsuario){
                    this.avatarUrl = `${this.usuarioService.obtenerRutaAvatar()}${responseUsuario.archivo}`;
                    var operacionAvatar = 2;

                    this.avatarForm.patchValue({
                        id_avatar: responseUsuario.id_avatar,
                        operacion: operacionAvatar
                    });
                }

                if(responseDatos){
                    var operacionDatos = 2;    

                    this.datosGralsForm.patchValue({
                        id_cuenta: responseDatos.id_cuenta,
                        primerNombre: responseDatos.primer_nombre,
                        segundoNombre: responseDatos.segundo_nombre ?? '',
                        apellidoPaterno: responseDatos.apellido_paterno,
                        apellidoMaterno: responseDatos.apellido_materno ?? '',
                        entidadNacimiento: responseDatos.id_entidad_nacimiento,
                        fechaNacimiento: DateUtils.parseDateOnly(responseDatos.fecha_nacimiento),
                        rfc: responseDatos.rfc,
                        curp: responseDatos.curp,
                        telefono: responseDatos.telefono,
                        operacion: operacionDatos
                    });
                }

                if(responseDom){
                    //Consulta simultanea de informacion
                    forkJoin({
                        municipios: this.catalogoService.obtenerListaMunicipio(1, responseDom.id_entidad),
                        localidades: this.catalogoService.obtenerListaLocalidad(1, responseDom.id_entidad, responseDom.id_municipio),
                        colonias: this.catalogoService.obtenerListaColonia(1, responseDom.id_entidad, responseDom.id_municipio, responseDom.id_localidad)
                    }).subscribe({
                        next: ({ municipios, localidades, colonias }) => { 
                            
                        this.loading = false;

                        this.municipios = municipios;
                        this.localidades = localidades;
                        this.colonias = colonias;

                        var operacionDom = 2;    

                        this.domForm.patchValue({
                            id_domicilio: responseDom.id_domicilio,
                            calle: responseDom.calle,
                            numExt: responseDom.numero_exterior,
                            numInt: responseDom.numero_interior,
                            codigoPostal: responseDom.codigo_postal,
                            pais: 1,
                            entidad: responseDom.id_entidad,
                            municipio: responseDom.id_municipio,
                            localidad: responseDom.id_localidad,
                            colonia: responseDom.id_colonia,
                            operacion: operacionDom    
                        });
                    },
                        error: err => console.error(err)
                    }); 
                }
                else{
                    this.loading = false;
                }
            },
            error: (error) => {
                console.error('Error al obtener los datos', error);
            }
        });
    }

    constructor(private fb: UntypedFormBuilder, private catalogoService: CatalogoService
                ,private authService: AutenticacionService, private usuarioService: UsuarioService
                ,private cuentaService: CuentaService, private modalService: NzModalService
                ,private message: NzMessageService, private notificacion: NzNotificationService) { 
    }

    customUpload = (item: NzUploadXHRArgs) : Subscription => {
        const maxSize = 1 * 1024 * 1024; // 1 MB
        const file = item.postFile as File

        if (file.size! > maxSize) {
            this.message.error(`${file.name} excede el tamaño máximo permitido de 1 MB`);
            return new Subscription();
        }

        this.loading = true;

        const currentUser = this.authService.obtenerUsuarioActual();

        const formData = new FormData();

        formData.append('id_avatar', this.avatarForm.get('id_avatar')?.value);
        formData.append('id_usuario', currentUser.id_usuario.toString());
        formData.append('file_avatar', item.postFile as File);
        formData.append('operacion', this.avatarForm.get('operacion')?.value);

        return this.usuarioService.actualizarAvatar(formData).subscribe({
            next: (res) => {
                item.onSuccess!(res, item.file, undefined);

                this.avatarForm.patchValue({
                    id_avatar: res.resultado,
                    operacion: 2
                });

                this.getBase64(item.postFile as File, (img: string) => {
                    this.avatarUrl = img;
                    this.usuarioService.asignarAvatar(img);
                    this.loading = false;
                });

                this.notificacion.success('Usuario', 'Avatar actualizado correctamente');
            },
            error: (error) => {
                item.onError!(error, item.file);
                this.loading = false;
                this.notificacion.error('Usuario', 'No fue posible cargar el archivo');
            }
        });
    };

    public guardarDatos(): void{
        this.loading = true;

        const currentUser = this.authService.obtenerUsuarioActual();

        const formData = new FormData();

        formData.append('id_cuenta', this.datosGralsForm.get('id_cuenta')?.value ?? 0);
        formData.append('id_usuario', currentUser.id_usuario.toString());
        formData.append('primer_nombre', this.datosGralsForm.get('primerNombre')?.value);
        const segundoNombre = this.datosGralsForm.get('segundoNombre')?.value;
        if (segundoNombre) {
            formData.append('segundo_nombre', segundoNombre);
        }
        formData.append('apellido_paterno', this.datosGralsForm.get('apellidoPaterno')?.value);
        const apellidoMaterno = this.datosGralsForm.get('apellidoMaterno')?.value;
        if (apellidoMaterno) {
            formData.append('apellido_materno', apellidoMaterno);
        }
        formData.append('id_entidad_nacimiento', this.datosGralsForm.get('entidadNacimiento')?.value);
        formData.append('fecha_nacimiento', formatDate(this.datosGralsForm.get('fechaNacimiento')?.value,'yyyy-MM-dd','en-US'));
        formData.append('rfc', this.datosGralsForm.get('rfc')?.value);
        formData.append('curp', this.datosGralsForm.get('curp')?.value);
        formData.append('telefono', this.datosGralsForm.get('telefono')?.value);
        formData.append('operacion', this.datosGralsForm.get('operacion')?.value);

        this.cuentaService.guardarDatos(formData)
            .subscribe({
                next: (res) => {
                    this.loading = false;

                    if(res.estatus_code === 200){
                        this.notificacion.success('Datos Personales', res.mensaje);
                        this.datosGralsForm.patchValue({
                            id_cuenta: res.resultado,
                            operacion: 2
                        });
                    }
                    else
                        this.notificacion.error('Datos Personales', res.mensaje);
                },
                error: (err) => {
                    console.error('Error en registro', err);
                    this.loading = false;
                }
            });
    }

    public guardarDomicilio(): void{
        this.loading = true;

        const currentUser = this.authService.obtenerUsuarioActual();

        const formData = new FormData();

        formData.append('id_domicilio', this.domForm.get('id_domicilio')?.value ?? 0);
        formData.append('id_usuario', currentUser.id_usuario.toString());
        formData.append('calle', this.domForm.get('calle')?.value);
        formData.append('numero_exterior', this.domForm.get('numExt')?.value);
        const numInt = this.domForm.get('numInt')?.value;
        if (numInt) {
            formData.append('numero_interior', numInt);
        }
        formData.append('id_pais', this.domForm.get('pais')?.value);
        formData.append('id_entidad', this.domForm.get('entidad')?.value);
        formData.append('id_municipio', this.domForm.get('municipio')?.value);
        formData.append('id_localidad', this.domForm.get('localidad')?.value);
        formData.append('id_colonia', this.domForm.get('colonia')?.value);
        formData.append('operacion', this.domForm.get('operacion')?.value);

        this.cuentaService.guardarDomicilio(formData)
            .subscribe({
                next: (res) => {
                    this.loading = false;
                    if(res.estatus_code === 200){   
                        this.notificacion.success('Domicilio', res.mensaje);
                        
                        this.domForm.patchValue({
                            id_domicilio: res.resultado,
                            operacion: 2
                        });
                    }
                    else{
                        this.notificacion.error('Domicilio', res.mensaje);
                    }
                },
                error: (err) => {
                    console.error('Error en registro', err);
                    this.loading = false;
                }
            });
    }

    updateConfirmValidator(): void {
        Promise.resolve().then(() =>
            this.passForm.controls.checkPassword.updateValueAndValidity()
        );
    }
    
    confirmationValidator = (control: UntypedFormControl): any => {
        if (!control.value) {
            return { required: true };
        }

        const password = this.passForm?.get('newPassword')?.value;

        if (control.value !== password) {
            return { passwordMismatch: true };
        }

        return null;
    }

    public iniciarFormularios():void{
        this.avatarForm = this.fb.group({
            id_avatar: [0],
            operacion: [1]
        });
        
        this.usuarioForm = this.fb.group({
            email: [ null ]
        });

        this.passForm = this.fb.group({
            oldPassword: [ null, [ Validators.required ] ],
            newPassword: [ null, [ Validators.required ] ],
            confirmPassword: [ null, [ Validators.required, this.confirmationValidator ] ]
        });

        this.passForm.get('newPassword')?.valueChanges.subscribe(() => {
            this.passForm.get('confirmPassword')?.updateValueAndValidity();
        });

        this.datosGralsForm = this.fb.group({
            id_cuenta: [0],
            primerNombre: [ null, [ Validators.required ] ],
            segundoNombre: [ null, [ Validators.nullValidator ] ],
            apellidoPaterno: [ null, [ Validators.required ] ],
            apellidoMaterno: [ null, [ Validators.nullValidator ] ],
            entidadNacimiento: [ null, [ Validators.required ] ],
            fechaNacimiento: [ null, [ Validators.required ] ],
            rfc: [ null, [ Validators.required ] ],
            curp: [ null, [ Validators.required ] ],
            telefono: [ null, [ Validators.required ] ],
            operacion: [1]
        });

        this.domForm = this.fb.group({
            id_domicilio: [0],
            calle: [ null, [ Validators.required ] ],
            numExt: [ null, [ Validators.required ] ],
            numInt: [ null, [ Validators.nullValidator ] ],
            codigoPostal: [ null, [ Validators.required ] ],
            pais: [1],
            entidad: [ null, [ Validators.required ] ],
            municipio: [ null, [ Validators.required ] ],
            localidad: [ null, [ Validators.required ] ],
            colonia: [ null, [ Validators.required ] ],
            operacion: [1]
        });
    }

    ngOnInit(): void {
        this.iniciarFormularios();

        this.loading = true;

        this.domForm.get('entidad')?.valueChanges.subscribe(id => {
            if (!id)
                return;

             // Limpiar el valor seleccionado
            this.domForm.get('municipio')?.reset(null, { emitEvent: false });
            this.domForm.get('localidad')?.reset(null, { emitEvent: false });
            this.domForm.get('colonia')?.reset(null, { emitEvent: false });

            // Limpiar las opciones
            this.municipios = [];
            this.localidades = [];
            this.colonias = [];
        
            this.obtenerMunicipios(id);
        });

        this.domForm.get('municipio')?.valueChanges.subscribe(id => {
            if (!id)
                return;

            this.domForm.get('localidad')?.reset(null, { emitEvent: false });
            this.domForm.get('colonia')?.reset(null, { emitEvent: false });

            this.localidades = [];
            this.colonias = [];

            this.obtenerLocalidades(id);
        });

        this.domForm.get('localidad')?.valueChanges.subscribe(id => {
            if (!id)
                return;

            this.domForm.get('colonia')?.reset(null, { emitEvent: false });

            this.colonias = [];

            this.obtenerColonias(id);
        });

        this.catalogoService.obtenerListaEntidad(1)
        .subscribe({
            next: data => {
                this.entidades = data;
                this.cargarFormularios();
            },
            error: err => console.error(err)
        });
    }

    public obtenerColonias(id_localidad: number):void{
        var id_pais = this.domForm.get('pais')?.value;
        var id_entidad = this.domForm.get('entidad')?.value;
        var id_municipio = this.domForm.get('municipio')?.value;

        this.catalogoService.obtenerListaColonia(id_pais, id_entidad, id_municipio, id_localidad)
        .subscribe({
            next: data => {
                this.colonias = data;
            },
            error: err => console.error(err)
        });
    }

    public obtenerLocalidades(id_municipio: number):void{
        var id_pais = this.domForm.get('pais')?.value;
        var id_entidad = this.domForm.get('entidad')?.value;

        this.catalogoService.obtenerListaLocalidad(id_pais, id_entidad, id_municipio)
        .subscribe({
            next: data => {
                this.localidades = data;
            },
            error: err => console.error(err)
        });
    }

    public obtenerMunicipios(id_entidad: number):void{
        var id_pais = this.domForm.get('pais')?.value;

        this.catalogoService.obtenerListaMunicipio(id_pais, id_entidad)
        .subscribe({
            next: data => {
                this.municipios = data;
            },
            error: err => console.error(err)
        });
    }

    showConfirmDatos(): void {
        this.modalService.confirm({
            nzTitle  : '<i>¿Desea confirmar la modificación de los datos personales?</i>',
            nzOnOk   : () => { 
                this.guardarDatos();
            }
        });
    }

    showConfirmDir(): void {
        this.modalService.confirm({
            nzTitle  : '<i>¿Desea confirmar la modificación de su dirección?</i>',
            nzOnOk   : () => { 
                this.guardarDomicilio();
            }
        });
    }

    showConfirmPwd(): void {
        this.modalService.confirm({
            nzTitle  : '<i>¿Desea confirmar la modificación de la contraseña?</i>',
            nzOnOk   : () => {
                this.actualizarPassword();
            }
        });
    }

    submitFormDatos(): void {
        for (const i in this.datosGralsForm.controls) {
            this.datosGralsForm.controls[ i ].markAsDirty();
            this.datosGralsForm.controls[ i ].updateValueAndValidity();
        }
        this.showConfirmDatos();
    }

    submitFormDir(): void {
        /*for (const i in this.dirForm.controls) {
            this.dirForm.controls[ i ].markAsDirty();
            this.dirForm.controls[ i ].updateValueAndValidity();
        }
        this.showConfirmDir();*/

        this.domForm.markAllAsTouched();

        if (this.domForm.invalid) {
            return;
        }
        this.showConfirmDir();
    }

    submitFormPwd(): void {
        for (const i in this.passForm.controls) {
            this.passForm.controls[ i ].markAsDirty();
            this.passForm.controls[ i ].updateValueAndValidity();
        }
        this.showConfirmPwd();
    }

    private getBase64(img: Blob, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
}    