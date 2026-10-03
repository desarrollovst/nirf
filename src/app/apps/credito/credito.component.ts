import { Component, TemplateRef } from '@angular/core';
import { TableService } from '../../shared/services/table.service';
import { AutenticacionService } from '../../shared/services/autenticacion.service';
import { CreditoService } from '../../shared/services/credito.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Credito } from '../../shared/interfaces/credito.type';

@Component({
    templateUrl: './credito.component.html'
})

export class CreditoComponent  {
    view: string = 'listView';
    loading: boolean = false;
    creditoListRaw: Credito[];
    creditoList: Credito[];
    searchInput: string;

    buscarRegistro() {
        const data = this.creditoListRaw
        this.creditoList = this.tablesvc.search(this.searchInput, data)
    }

    cargarListado(){
        const currentUser = this.authService.obtenerUsuarioActual();

        this.loading = true;    

        this.creditoService.obtenerListaCredito(currentUser.id_usuario)
        .subscribe({
            next: (data) => {
                this.creditoListRaw = data;
                this.creditoList = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener créditos', error);
                this.loading = false;
            }
        });
    }

    constructor (private tablesvc: TableService, private authService: AutenticacionService
                ,private creditoService: CreditoService, private message: NzMessageService) {}

    ngOnInit(): void {
        this.cargarListado();
    }
} 