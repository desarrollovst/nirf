import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
    private apiSolicitudUrl;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiSolicitudUrl = this.configService.settings.apiSolicitudUrl;
    }

    public eliminarSolicitud(id: number){
        return this.http.post(`${this.apiSolicitudUrl}/elimina`, id);
    }

    public guardarSolicitud(formData: FormData){
        return this.http.post<any>(`${this.apiSolicitudUrl}`, formData)
            .pipe(map(solicitud => {
                return solicitud;
            }));
    }

    public obtenerListaSolicitud(id_usuario: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiSolicitudUrl}/solicitudes/${id_usuario}`);
    }

    public obtenerSolicitud(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiSolicitudUrl}/${id}`);
    } 
}