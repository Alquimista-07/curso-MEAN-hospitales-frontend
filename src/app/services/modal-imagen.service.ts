import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventEmitter } from '@angular/core';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;

  public tipo!: 'usuarios' | 'medicos' | 'hospitales';
  public id: string = '';
  public img: string = '';

  // Observable que emite cuando cambia la imágen
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal( tipo: 'usuarios' | 'medicos' | 'hospitales', id: string, img: string = 'no-image' ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // this.img = img || '';

    if( img.includes('https') ){
      this.img = img;
    } else {
      // http://localhost:3000/api/upload/usuarios/23rrgdf3t434
      this.img = `${ base_url }/upload/${ tipo }/${ img }`;
    }
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
