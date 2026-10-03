import { SideNavInterface } from '../../interfaces/side-nav.type';

export const ROUTES: SideNavInterface[] = [
    {
        path: '/apps/cuenta',
        title: 'Cuenta',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'user',
        submenu: []
    },
    {
        path: '/apps/simulador',
        title: 'Simulador de Crédito',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'calculator',
        submenu: []
    },
    {
        path: '/apps/solicitud',
        title: 'Solicitudes',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'file-add',
        submenu: []
    },
    {
        path: '/apps/creditos',
        title: 'Créditos',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dollar',
        submenu: []
    }
]    