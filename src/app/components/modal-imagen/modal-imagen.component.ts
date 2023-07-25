import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  // Creamos una nueva propidad que va a servir para subir la imágen
  public imagenSubir!: File;

  // Creamos otra propiedad para la previsualización de la imágen que ya sabemos que es un string en base 64 temporal
  public imgTemp: any = '';

  // Acá colocamos la inyqcción del servicio como publica para poder usarla del lado del html,
  // en caso contrario la dejamos como privada cuando la usamos solo en el componente .ts
  constructor( public modalImagenService: ModalImagenService, public fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto( this.imagenSubir, tipo, id )
    .then( img => {
      if ( img != null ){
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        // Emitimos el valor con el observable que creamos en el modal-imagen.service.ts
        // para detectar el cambio de la imágen para que la cargue en la tabla
        this.modalImagenService.nuevaImagen.emit(img);

        this.cerrarModal();
      } else{
        Swal.fire('Error', 'No se pudo subir la imágen', 'error');
      }
    });
  }

}
