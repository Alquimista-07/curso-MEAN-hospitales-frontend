import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  // Usando fetch api vamos a subir las imágenes
  // NOTA: En los métodos si podemos usar el async pero en el constructor no se puede ya que el constructor
  //       simepre tiene que ser síncrono
  // Recibimos los argumentos que voy a necesitar para actualizar una fotografía.
  async actualizarFoto( 
    archivo: File, 
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
    ) {

    try {

      const url = `${ base_url }/upload/${ tipo }/${id}`;

      // Ahora necesitamos preparar la data que vamos a enviar al fetch y para ello vamos a usar el form data propio de JavaScript
      const formData = new FormData();

      // Hacemos el append de lo que necesito por ejemplo del body que es la imagen,
      // pero si necesitamos enviar más cosas se puede hacer
      formData.append( 'imagen', archivo );

      // Hacemos la petición
      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      // console.log( data );

      if( data.ok ){
        return data.nombreArchivo;
      } else {
        console.log( data.msg );
        return null;
      }

    }catch (error) {
      console.log(error);
      return false;
    }


  }

}
