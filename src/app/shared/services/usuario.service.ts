import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class UsuarioService {
    private apiUsuarioUrl: string;
    private urlBaseAvatar: string;
    private avatarSubject = new BehaviorSubject<any>(null);
    currentAvatar = this.avatarSubject.asObservable();

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiUsuarioUrl = this.configService.settings.apiUsuarioUrl;
        this.urlBaseAvatar = this.configService.settings.urlBaseAvatar;
    }

    public actualizarAvatar(userData: any): Observable<any>{
        return this.http.post(`${this.apiUsuarioUrl}/actualizaAvatar`, userData);
    }

    public actualizarPassword(userData: any): Observable<any>{
        return this.http.post(`${this.apiUsuarioUrl}/actualizaPassword`, userData);
    }

    public asignarAvatar(avatar: string){
        this.avatarSubject.next(avatar);    
    }

    public obtenerAvatar(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.apiUsuarioUrl}/avatar/${id}`);
    }

    public obtenerRutaAvatar():string{
        return this.urlBaseAvatar;
    }

    public procesarConfirmacion(token: string): Observable<any>{
        //Se envía el token como un objeto
        return this.http.post(`${this.apiUsuarioUrl}/procesaConfirmacion`, { token });
    }

    public procesarRecuperacion(token: string): Observable<any>{
        //Se envía el token como un objeto
        return this.http.post(`${this.apiUsuarioUrl}/procesaRecuperacion`, { token });
    }

    public recuperarPassword(userData: any) {
        return this.http.post<any>(`${this.apiUsuarioUrl}/recuperaPassword`, userData)
        .pipe(map(res => {
            return res;
        }));
    }

    public reenviarConfirmacion(userData: any): Observable<any>{
        return this.http.post<any>(`${this.apiUsuarioUrl}/reenviaConfirmacion`, userData)
        .pipe(map(res => {
            return res;
        }));
    }

    public registrar(userData: any) {
        return this.http.post<any>(`${this.apiUsuarioUrl}`, userData)
            .pipe(map(user => {
                return user;
            }));
    }

    public restaurarPassword(userData: any): Observable<any>{
        return this.http.post(`${this.apiUsuarioUrl}/restauraPassword`, userData);
    }
}