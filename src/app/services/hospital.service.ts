import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Hospital, HospitalInterface } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarHospitales( desde: number = 0 ){

    const url = `${ base_url }/hospitales?desde=${ desde }`;
    return this.http.get<HospitalInterface>( url, this.headers )
               .pipe(
                  map( resp => {
                    // Arreglo de tipo hospitales
                    const hospitales = resp.hospitales.map(
                      hospital => new Hospital( hospital.nombre, hospital._id, hospital.img, hospital.usuario ) 
                      );
                    return {
                      total: resp.total,
                      hospitales
                    }
                  }))

  }

  crearHospital( nombre: string ) {

    const url = `${ base_url }/hospitales`;
    return this.http.post( url, { nombre },  this.headers );

  }

  actualizarHospital( _id: string, nombre: string ) {

    const url = `${ base_url }/hospitales/${ _id }`;
    return this.http.put( url, { nombre },  this.headers );

  }

  borrarHospital( _id: string ){

    const url = `${ base_url }/hospitales/${ _id }`;
    return this.http.delete( url, this.headers );

  }

}
