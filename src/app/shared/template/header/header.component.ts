import { Component } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { AutenticacionService } from '../../services/autenticacion.service';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent{
    searchVisible : boolean = false;
    quickViewVisible : boolean = false;
    isFolded : boolean;
    isExpand : boolean;
    email: string;
    nombre: string;
    imgAvatar: string;
    avatar: any;
    subscription!: Subscription;
    
    constructor(private themeService: ThemeConstantService, private authService: AutenticacionService
               ,private usuarioService: UsuarioService
    ) {}

    ngOnInit(): void {
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);

        var usuario = this.authService.obtenerUsuarioActual();

        //suscripcion creada para actualizar el avatar cuando se modifique
        //la imagen en el mantenimiento de usuario
        this.subscription = this.usuarioService.currentAvatar
        .subscribe(avatar => {
            this.imgAvatar = avatar;
        });

        this.email = usuario.email;
        this.nombre = usuario.nombre;

        if(usuario.avatar !== "")
            this.imgAvatar = `${this.usuarioService.obtenerRutaAvatar()}${usuario.avatar}`;
        else
            this.imgAvatar = "assets/images/avatars/user.png";
    }

    toggleFold() {
        this.isFolded = !this.isFolded;
        this.themeService.toggleFold(this.isFolded);
    }

    toggleExpand() {
        this.isFolded = false;
        this.isExpand = !this.isExpand;
        this.themeService.toggleExpand(this.isExpand);
        this.themeService.toggleFold(this.isFolded);
    }

    logout(): void{
        this.authService.logout();
    }
}
