import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];

  // Propiedad para quitar la suscripción al observable que actualiza la imágen
  // para evitar tener fugas de memoria
  public imgSubs!: Subscription;

  // Propiedad para tener la referencia a la página actual
  public desde: number = 0;
  // Propiedad para almacenar los usuarios actuales
  public usuariosTemp: Usuario[] = [];

  // Propiedad para manera el loading
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService, private busquedaService: BusquedasService, private modalImgenService: ModalImagenService ) { }

  ngOnInit(): void {

    this.cargarUsuarios();

    // Nos subscribimos al observable que creamos en el modal-imagen.service.ts y que se encarga de emitir un valor
    // con el fin de cargar la nueva imágen
    this.imgSubs = this.modalImgenService.nuevaImagen
    .pipe(
      delay(1000)
    ).subscribe( img => {
        this.cargarUsuarios() 
      });

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  // Método para cargar usuarios
  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
        .subscribe( ({ total, usuarios }) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
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
    } else if ( this.desde >= this.totalUsuarios ){
      this.desde -= valor;
    }

    this.cargarUsuarios();

  }

  // Método para buscar usuarios o médicos u hospitales
  buscar ( termino: string ){
    
    if( termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.bucar( 'usuarios', termino )
        .subscribe( (resultados: Usuario[]) => {

          this.usuarios = resultados;
          
        });

    return;
  }

  // Método para eliminar usuarios
  eliminarUsuario( usuario: Usuario ) {

    if( usuario.uid === this.usuarioService.usuario.uid ){
      return Swal.fire('Error', "No puede borrarse a si mismo", 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
            .subscribe( resp => {
              Swal.fire(
                'Eliminado!',
                `El usuario ${ usuario.nombre } ha sido eliminado.`,
                'success'
                )
              this.cargarUsuarios();
            });
      }
    });

    return;

  }

  // Método para cambiar el role del usuario
  cambiarRole( usuario: Usuario ){
    
    this.usuarioService.guardarUsuario( usuario )
        .subscribe( resp => {
          console.log(resp);
        });
  }

  abrirModal( usuario: Usuario ){
    this.modalImgenService.abrirModal('usuarios', usuario.uid!, usuario.img );
  }

}
