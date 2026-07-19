import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
    private apiCatalogoUrl:string;
    
    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiCatalogoUrl = this.configService.settings.apiCatalogoUrl;
    }

    public obtenerListaEntidad(pais: number): Observable<any>{
        return this.http.get<any[]>(`${this.apiCatalogoUrl}/entidad/${pais}`);
    }

    public obtenerListaMunicipio(pais:number, entidad: number): Observable<any>{
        return this.http.get<any[]>(`${this.apiCatalogoUrl}/municipio/${pais}/${entidad}`);
    }

    public obtenerListaLocalidad(pais:number, entidad: number, municipio: number): Observable<any>{
        return this.http.get<any[]>(`${this.apiCatalogoUrl}/localidad/${pais}/${entidad}/${municipio}`);
    }

    public obtenerListaColonia(pais:number, entidad: number, municipio: number, localidad: number): Observable<any>{
        return this.http.get<any[]>(`${this.apiCatalogoUrl}/colonia/${pais}/${entidad}/${municipio}/${localidad}`);
    }

    public obtenerCodigoPostal(colonia: number): Observable<any>{
        return this.http.get<any[]>(`${this.apiCatalogoUrl}/codigoPostal/${colonia}`);
    }
}