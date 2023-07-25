// Clase que va a contener el modelo completo de un usuario

import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Usuario {

    // Los parametros que son opcionales tienen que ir al final (y el ? indica que es opcional) y los que son obligatorios al inicio
    constructor(
        public nombre: string, 
        public email: string, 
        public password?: string, 
        public img?: string, 
        public google?: boolean, 
        public role?: 'ADMIN_ROLE' | 'USER_ROLE', 
        public uid?: string) {}

    get imagenUrl() {

        if ( !this.img ){
            return `${ base_url }/upload/usuarios/no-image`;
        } else if(this.img?.includes('https')){
            return this.img;
        } else if( this.img ){
            return `${ base_url }/upload/usuarios/${ this.img }`;
        } else{
            return `${ base_url }/upload/usuarios/no-image`; 
        }
    }

}