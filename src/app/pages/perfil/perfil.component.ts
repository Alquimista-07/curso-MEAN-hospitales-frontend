import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;

  // Creamos una nueva propidad que va a servir para subir la imágen
  public imagenSubir!: File;

  // Creamos otra propiedad para la previsualización de la imágen que ya sabemos que es un string en base 64 temporal
  public imgTemp: any = '';

  constructor( private fb: FormBuilder, private usuariService: UsuarioService,
    private fileUploadService: FileUploadService ) { 
    this.usuario = usuariService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required ],
      email: [ this.usuario.email, [ Validators.required, Validators.email ] ]
    });

  }

  actualizarPerfil() {
    // console.log( this.perfilForm.value );
    this.usuariService.actualizarPerfil( this.perfilForm.value )
        .subscribe( () => {
          // console.log(resp);
          const { nombre, email } = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Guardado', 'Cambios efectuados correctamente', 'success');
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error')
        });
  }

  cambiarImagen( file: File ){
    // console.log(file);
    this.imagenSubir = file;

    // NOTA: Ahora lo que vamos a hacer es recuperar la imágen que seleccionamos para mistrarla en la caja de imágen
    //       Para tener algo así como una previsualización de la misma. Para ello hacemos lo siguiente
    
    // Si no existe el archivo no continue y no hace nada
    if( !file ){
      return this.imgTemp = null;
    }

    // Si existe continua acá
    // Para esto vamos a creamos un string en base 64 que va a permitir mostrar la imágen, usando
    // un método propio de JavaScript que es el FileReader
    // OJO: Esto no lo deberíamos hacer para grabar en una base de datos ya que es un string muy grande
    //      pero para una previsualización no hay problema ya que no sirve para hacer lo que queremos hacer
    const reader = new FileReader();

    reader.readAsDataURL( file );

    // Procedimiento cuando se carga
    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log( reader.result );
    }

    return;

  }

  subirImagen() {
    this.fileUploadService.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid! )
    .then( img => {
      this.usuario.img = img;
      if ( img != null ){
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      } else{
        Swal.fire('Error', 'No se pudo subir la imágen', 'error');
      }
    });
  }

}
