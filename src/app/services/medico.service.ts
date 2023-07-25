import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Medico, MedicoInterface } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos( desde: number = 0 ){

    // http://localhost:3000/api/medicos?desde=0
    const url = `${ base_url }/medicos?desde=${ desde }`;
    return this.http.get<MedicoInterface>( url, this.headers )
               .pipe(
                  map( resp => {
                    // Arreglo de tipo medicos
                    const medicos = resp.medicos.map(
                      medicos => new Medico( medicos.nombre, medicos._id, medicos.img, medicos.usuario, medicos.hospital ) 
                      );
                    return {
                      total: resp.total,
                      medicos
                    }
                  }))

  }

  obtenerMedicoPorId( id: string ){

    const url = `${ base_url }/medicos/${ id }`;
    return this.http.get( url, this.headers )
               .pipe(
                map( (resp: {ok: boolean, medico: Medico[]} | any) => {
                  return resp.medico;
                })
               )

  }

  crearMedico( medico: { nombre: string, hospital: string } ) {

    // http://localhost:3000/api/medicos
    const url = `${ base_url }/medicos`;
    return this.http.post( url, medico,  this.headers );

  }

  actualizarMedico( medico: Medico ) {

    // http://localhost:3000/api/medicos/641c6a64abbadf4c36e5397f
    const url = `${ base_url }/medicos/${ medico._id }`;
    return this.http.put( url, medico,  this.headers );

  }

  borrarMedico( _id: string ){

    // http://localhost:3000/api/medicos/641c6a64abbadf4c36e5397f
    const url = `${ base_url }/medicos/${ _id }`;
    return this.http.delete( url, this.headers );

  }

}
