import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  // Propiedad para tener el total de usuarios
  public totalMedicos: number = 0;
  // Propiedad para almacenar los usuarios actuales
  public medicosTemp: Medico[] = [];

  // Propiedad para tener la referencia a la página actual
  public desde: number = 0;

  // Propiedad para mostrar los hospitales
  public medicos: Medico[] = [];
  public cargando: boolean = true;

  private imgSubs!: Subscription;

  constructor( private medicoService: MedicoService, private modalImagenService: ModalImagenService, private busquedaService: BusquedasService ) { }

  ngOnInit(): void {

    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe( delay( 1000 ) )
        .subscribe( img => this.cargarMedicos() );

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){

    this.cargando = true;

    this.medicoService.cargarMedicos( this.desde )
        .subscribe( ({ total, medicos }) => {
          this.totalMedicos = total;
          this.medicos = medicos;
          this.medicosTemp = medicos;
          this.cargando = false;
        });

  }

  // Método para cambiar la página
  cambiarPagina( valor: number ){

    // Cambiamos el valor actual de la pagina y le sumamos uno
    this.desde += valor;

    // Validaciones para evitar que el limite se salga de lo estipulado
    if( this.desde < 0 ){
      this.desde = 0;
    } else if ( this.desde >= this.totalMedicos ){
      this.desde -= valor;
    }

    this.cargarMedicos();

  }

  abrirModal( medico: Medico ){

    this.modalImagenService.abrirModal( 'medicos', medico._id!, medico.img );
  
  }

  buscar( termino: string ){

    if( termino.length === 0 ){
      return this.medicos = this.medicosTemp;
    }

    this.busquedaService.bucar( 'medicos', termino )
        .subscribe( resultados => {

          this.medicos = resultados;
          
        });

    return;

  }

  borrarMedico( medico: Medico ){

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico( medico._id! )
            .subscribe( resp => {
              Swal.fire(
                'Eliminado!',
                `${ medico.nombre } ha sido eliminado.`,
                'success'
                )
              this.cargarMedicos();
            });
      }
    });

  }

}
