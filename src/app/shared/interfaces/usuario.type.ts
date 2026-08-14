export interface Usuario {
    id_usuario: number;
    email: string;
    nombre: string;
    nombre_completo?: string;
    avatar: string;
    token?: string;
}