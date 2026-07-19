import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
    private apiCuentaUrl:string;
    private apiDomicilioUrl:string;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiCuentaUrl = this.configService.settings.apiCuentaUrl;
        this.apiDomicilioUrl = this.configService.settings.apiDomicilioUrl;
    }

    public guardarDatos(cuentaData: any) {
        return this.http.post<any>(`${this.apiCuentaUrl}`, cuentaData)
            .pipe(map(cuenta => {
                return cuenta;
            }));
    }

    public guardarDomicilio(domicilioData: any) {
        return this.http.post<any>(`${this.apiDomicilioUrl}`, domicilioData)
            .pipe(map(domicilio => {
                return domicilio;
            }));
    }

    public obtenerDatos(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiCuentaUrl}/${id}`);
    }

    public obtenerDomicilio(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiDomicilioUrl}/${id}`);
    }

    public validar(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiCuentaUrl}/valida/${id}`);
    } 
}