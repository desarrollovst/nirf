export class CuentaUtils {
  static formatearNombre(primer_nombre:string | null, segundo_nombre:string | null
                        ,apellido_paterno:string | null, apellido_materno:string | null
                        ,orden:number): string {
   
    if(orden === 1){
		return [
            primer_nombre,
            segundo_nombre,
            apellido_paterno,
            apellido_materno
        ]
        .filter((valor): valor is string => !!valor?.trim())
        .map(valor => valor.trim())
        .join(' ');
    }
	else if(orden === 2){ 
		return [
            apellido_paterno,
            apellido_materno,
            primer_nombre,
            segundo_nombre
        ]
        .filter((valor): valor is string => !!valor?.trim())
        .map(valor => valor.trim())
        .join(' ');
    }
  }
}