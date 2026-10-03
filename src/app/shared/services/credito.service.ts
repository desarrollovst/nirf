import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {
    private apiCreditoUrl;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiCreditoUrl = this.configService.settings.apiCreditoUrl;
    }

    public obtenerListaCredito(id_usuario: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiCreditoUrl}/creditos/${id_usuario}`);
    }
}