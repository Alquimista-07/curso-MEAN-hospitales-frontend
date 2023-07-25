// Interface para el tipado del formulario de registro

export interface RegisterForm {
    nombre: string;
    email:  string;
    password:   string;
    password2: string;
    terminos: boolean;
}