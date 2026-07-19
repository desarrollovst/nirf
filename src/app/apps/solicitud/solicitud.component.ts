import { Component, TemplateRef } from '@angular/core';
import { AutenticacionService } from '../../shared/services/autenticacion.service';
import { SolicitudService } from '../../shared/services/solicitud.service';
import { CuentaService } from '../../shared/services/cuenta.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Solicitud } from '../../shared/interfaces/solicitud.type';
import { TableService } from '../../shared/services/table.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './solicitud.component.html',
    styleUrls: ['./solicitud.component.scss']
})

export class SolicitudComponent  {
    view: string = 'listView';
    loading: boolean = false;
    loadingModal: boolean = false;
    nuevaSolicitud: boolean = false;
    solicitudListRaw: Solicitud[];
    solicitudList: Solicitud[];
    searchInput: string;
    solicitudForm: UntypedFormGroup;
    identificacionArchivo!: File;
    reciboArchivo!: File;
    comprobanteArchivo!: File;
    constanciaArchivo!: File;
    cuentaArchivo!: File;

    beforeUpload = (file: File, nombreControl: string, archivoControl: string): boolean => {
        const maxSize = 3 * 1024 * 1024; // 3 MB

        if (file.size! > maxSize) {
            this.message.error(`${file.name} excede el tamaño máximo permitido de 3 MB`);
            return false;
        }

        this.solicitudForm.patchValue({
            [nombreControl]: file.name,
            [archivoControl]: file
        });
        return false;
    };

    cargaComprobante = (file: File): boolean =>
        this.beforeUpload(file, 'comprobante', 'comprobanteArchivo');

    cargaConstancia = (file: File): boolean =>
        this.beforeUpload(file, 'constancia', 'constanciaArchivo');

    cargaCuenta = (file: File): boolean =>
        this.beforeUpload(file, 'cuenta', 'cuentaArchivo');

    cargaIdentificacion = (file: File): boolean =>
        this.beforeUpload(file, 'identificacion', 'identificacionArchivo');

    cargaRecibo = (file: File): boolean =>
        this.beforeUpload(file, 'recibo', 'reciboArchivo');

    cargarListado(){
        const currentUser = this.authService.obtenerUsuarioActual();

        this.loading = true;    

        this.solicitudService.obtenerListaSolicitud(currentUser.id_usuario)
        .subscribe({
            next: (data) => {
                this.solicitudListRaw = data;
                this.solicitudList = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener solicitudes', error);
                this.loading = false;
            }
        });
    }

    constructor (private authService: AutenticacionService, private solicitudService: SolicitudService
                ,private cuentaService: CuentaService, private tablesvc: TableService
                ,private modalService: NzModalService, private message: NzMessageService
                ,private notification: NzNotificationService, private fb: UntypedFormBuilder) {}

    eliminarSolicitud(item: any) {
        this.modalService.confirm({
            nzTitle: '¿Desea eliminar la solicitud seleccionada?',
            nzOnOk: () => {
                const formData = new FormData();

                formData.append('id_solicitud', item.id_solicitud);
                formData.append('id_usuario', item.id_usuario);
                formData.append('monto', item.monto);
                formData.append('plazo', item.plazo);
                formData.append('operacion', "3");    

                this.solicitudService.guardarSolicitud(formData)
                    .subscribe({
                        next: (response: any) => {
                            this.modalService.closeAll();
                            this.message.success(response.mensaje);
                            //this.notification.success('Solicitud', response.mensaje);
                            this.cargarListado();
                    },
                    error: (error) => {
                        console.error(error);
                        this.message.error('Ocurrió un error al eliminar la solicitud');
                        //this.notification.error('Solicitud', 'Ocurrió un error al eliminar la solicitud');
                    } 
                });
            }
        });
    }

    formatearMonto(): void {
        const control = this.solicitudForm.get('monto');

        if (!control?.value) {
            return;
        }

        const valor = Number(control.value);

        if (!isNaN(valor)) {
            control.setValue(valor.toFixed(2));
        }
    }

    public iniciarFormulario():void{
        const currentUser = this.authService.obtenerUsuarioActual();

        this.solicitudForm = this.fb.group({
            id_solicitud: [0],
            id_usuario: [currentUser.id_usuario],
            monto: [ null, [ Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/) ] ],
            periodicidad: [ null, [ Validators.required ] ],
            plazo: [ null, [ Validators.required, Validators.pattern(/^[0-9]+$/) ] ],
            destino: [ null, [ Validators.required ] ],
            estatus_solicitud: ['S'], 
            identificacion: [ null, [ Validators.required ] ],
            identificacionArchivo: [null],
            recibo: [ '', [ Validators.required ] ],
            reciboArchivo: [null],
            comprobante: [ '', [ Validators.required ] ],
            comprobanteArchivo: [null],
            constancia: [ '', [ Validators.required ] ],
            constanciaArchivo: [null],
            cuenta: [ '', [ Validators.required ] ],
            cuentaArchivo: [null],
            operacion: [1]
        });
    }

    private limpiarFormulario(): void {
        this.solicitudForm.reset();

        Object.values(this.solicitudForm.controls).forEach(control => {
            control.markAsPristine();
            control.markAsUntouched();
            control.updateValueAndValidity();
        });
        this.iniciarFormulario();
    }

    ngOnInit(): void {
        this.cargarListado();  
        this.iniciarFormulario();
    }

    search() {
        const data = this.solicitudListRaw
        this.solicitudList = this.tablesvc.search(this.searchInput, data)
    }

    mostrarNuevaSolicitud(solicitudContent: TemplateRef<{}>) {
        const currentUser = this.authService.obtenerUsuarioActual();

        this.cuentaService.validar(currentUser.id_usuario)
        .subscribe({
            next: (response) => {
                if (response.resultado === 1){
                    const modal = this.modalService.create({
                        nzTitle: 'Nueva Solicitud',
                        nzContent: solicitudContent,
                        nzFooter: [
                            {
                                label: 'Enviar',
                                type: 'primary',
                                onClick: () => {
                                    if (!this.solicitudForm.valid) {
                                        Object.values(this.solicitudForm.controls).forEach(control => {
                                            control.markAsDirty();
                                            control.updateValueAndValidity();
                                        });
                                        return false;
                                    }

                                    if(!this.loadingModal){
                                        this.modalService.confirm({
                                            nzTitle: '¿Desea enviar la solicitud capturada?',
                                            nzOnOk: () => {
                                                this.submitForm();
                                            }
                                        });
                                    }
                                }
                            },
                        ],
                        nzWidth: 800
                    });   
                    
                    modal.afterClose.subscribe(() => {
                        this.limpiarFormulario();
                    });
                }
                else{
                    this.message.error(response.mensaje);
                    //this.notification.error('Solicitud', response.mensaje);
                }
            },
            error: (error) => {
                console.error(error);
                //this.notification.error('Solicitud', 'Ocurrió un error al realizar la validación');
                this.message.error('Ocurrió un error al realizar la validación');
            }
        });
    }

    mostrarSolicitud(id:number, solicitudContent:TemplateRef<{}>) {
        this.solicitudService.obtenerSolicitud(id)
        .subscribe({
            next: (response) => {
                this.solicitudForm.patchValue({
                    id_solicitud: response.id_solicitud,
                    id_usuario: response.id_usuario,
                    fecha: response.fecha,
                    monto: response.monto,
                    periodicidad: response.periodicidad,
                    plazo: response.plazo,
                    destino: response.destino,
                    estatus_solicitud: response.estatus_solicitud,
                    identificacion: response.identificacion,
                    recibo: response.recibo,
                    comprobante: response.comprobante,
                    constancia: response.constancia,
                    cuenta: response.cuenta,
                    operacion: 2
                });

                this.formatearMonto();
        
            const modal = this.modalService.create({
                nzTitle: 'Editar Solicitud',
                nzContent: solicitudContent,
                nzFooter: [
                    {
                        label: 'Enviar',
                        type: 'primary',
                        onClick: () => {
                            if (!this.solicitudForm.valid) {
                                Object.values(this.solicitudForm.controls).forEach(control => {
                                    control.markAsDirty();
                                    control.updateValueAndValidity();
                                });
                                return false;
                            }

                            if(!this.loadingModal){
                                this.modalService.confirm({
                                    nzTitle: '¿Desea enviar la solicitud editada?',
                                    nzOnOk: () => {
                                        this.submitForm();
                                    }
                                });
                            }
                        }
                    },
                ],
                nzWidth: 800
            });   
                
            modal.afterClose.subscribe(() => {
                this.limpiarFormulario();
            });
        },
            error: (err) => {
                console.error(err);
                //this.notification.error('Solicitud', 'No fue posible obtener la información de la solicitud');
                this.message.error('No fue posible obtener la información de la solicitud');
            }
        });
    }

    soloDecimal(event: KeyboardEvent): void {
        const tecla = event.key;
        const input = event.target as HTMLInputElement;

        // Permitir números
        if (/^\d$/.test(tecla)) {
            return;
        }

        // Permitir un solo punto decimal
        if (tecla === '.' && !input.value.includes('.')) {
            return;
        }

        event.preventDefault();
    }

    soloEntero(event: KeyboardEvent): void {
        // Permitir únicamente dígitos
        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    }

    submitForm(): void {
        this.loadingModal = true;

        const formData = new FormData();

        formData.append('id_solicitud', this.solicitudForm.get('id_solicitud')?.value ?? 0);
        formData.append('id_usuario', this.solicitudForm.get('id_usuario')?.value);
        formData.append('monto', this.solicitudForm.get('monto')?.value);
        formData.append('periodicidad', this.solicitudForm.get('periodicidad')?.value);
        formData.append('plazo', this.solicitudForm.get('plazo')?.value);
        formData.append('destino', this.solicitudForm.get('destino')?.value);
        formData.append('estatus_solicitud', this.solicitudForm.get('estatus_solicitud')?.value);
        formData.append('identificacion', this.solicitudForm.get('identificacionArchivo')?.value);
        formData.append('recibo', this.solicitudForm.get('reciboArchivo')?.value);
        formData.append('comprobante', this.solicitudForm.get('comprobanteArchivo')?.value);
        formData.append('constancia', this.solicitudForm.get('constanciaArchivo')?.value);
        formData.append('cuenta', this.solicitudForm.get('cuentaArchivo')?.value);
        formData.append('operacion', this.solicitudForm.get('operacion')?.value);

        this.solicitudService.guardarSolicitud(formData)
            .subscribe({
                next: (response) => {
                    if(response.estatus_code === 200){
                        this.modalService.closeAll();
                        //this.notification.success('Solicitud', response.mensaje);
                        this.message.success(response.mensaje);
                        this.cargarListado();
                    }
                    else{
                        //this.notification.error('Solicitud', response.mensaje);
                        this.message.error(response.mensaje);    
                    }
                    this.loadingModal = false;
            },
            error: (error) => {
                console.error(error);
                //this.notification.error('Solicitud', 'Ocurrió un error al registrar la solicitud');
                this.message.error('Ocurrió un error al registrar la solicitud');
                this.loadingModal = false;
            } 
        });
    }

    validarPegado(event: ClipboardEvent): void {
        const texto = event.clipboardData?.getData('text') ?? '';

        if (!/^\d+(\.\d{0,2})?$/.test(texto))
            event.preventDefault();
    }

    validarPegadoEntero(event: ClipboardEvent): void {
        const texto = event.clipboardData?.getData('text') ?? '';

        if (!/^\d+$/.test(texto))
            event.preventDefault();
    }
} 