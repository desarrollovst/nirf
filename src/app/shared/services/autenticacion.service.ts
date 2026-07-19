import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario.type';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
    private currentUserSubject: BehaviorSubject<Usuario | null>;
    public currentUser: Observable<Usuario | null>;

    constructor(private http: HttpClient, private router: Router, private configService: ConfigService) {
        const user = localStorage.getItem('currentUser');

        this.currentUserSubject = new BehaviorSubject<Usuario | null>(user ? JSON.parse(localStorage.getItem('currentUser')): null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public obtenerUsuarioActual(): Usuario | null {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        const apiUrl = this.configService.settings.apiAuthUrl;
        
        return this.http.post<any>(`${apiUrl}/login`, { email, password })
        .pipe(map(user => {
            if (user && user.token) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/autenticacion/login']);
    }
}