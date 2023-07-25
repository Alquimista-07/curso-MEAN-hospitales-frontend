import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  // NOTA: Lo que tenemos dentro de este servicio lo podríamos usar convirtiendo los guetters en helpers
  //       para reutilizarlos de manera global

  constructor( private http: HttpClient ) { }

  // Getter para obtener el token
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // Getter para obtener los headers
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios( resultados: any[] ): Usuario[] {
    return resultados.map(
      user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid )
    );
  }

  private transformarHospitales( resultados: Hospital[] ): any[] {
    return resultados;
  }

  private transformarMedicos( resultados: any[] ): Medico[] {
    return resultados;
  }

  // Servicio para realizar búsquedas globales en todas las colecciones de usuarios, médicos y hospitales
  busquedaGlobal( termino: string ){

    const url = `${ base_url }/todo/${ termino }`;
    return this.http.get( url, this.headers );

  }

  // Servicio centralizado para buscar usuarios, médicos y hospitales
  bucar( tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string ) {
    const url = `${base_url}/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any[]>(url, this.headers )
               .pipe(
                map( (resp: any ) => {

                  switch ( tipo ) {
                    case 'usuarios':
                      return this.transformarUsuarios( resp.resultados );
                    
                    case 'hospitales':
                      return this.transformarHospitales( resp.resultados );

                    case 'medicos':
                      return this.transformarMedicos( resp.resultados );
                  
                    default:
                      return [];
                  }
                })
               )
  }

}
