import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacionService } from '../shared/services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AutenticacionService, private router: Router) 
  { 
  }

  canActivate(): boolean {
    const currentUser = this.authenticationService.obtenerUsuarioActual();

    if (currentUser && currentUser.token) {
      return true;
    }

    this.router.navigate(['/autenticacion/login']);
    return false;
  }
}