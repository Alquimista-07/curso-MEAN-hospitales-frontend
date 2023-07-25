import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  // Propiedad para mostrar el hospital
  public hospitalSeleccionado: Hospital | any;

  // Propiedad para manejar la imágen del nuevo médico
  public medicoSeleccionado!: Medico;

  constructor( private fb: FormBuilder, private hospitalService: HospitalService, private medicoService: MedicoService,
               private router: Router, private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    // NOTA: Necesitamos el id del médico, y lo vamos a manejar como una subscripción, ya que puede ser que estemos en la misma pantall
    //       y el url puede cambiar, podemos hacerlo por el snapshot pero el snapchot no cambia una vez se lee, por lo tanto lo vamos 
    //       a obtener suscribiendonos a la ruta activa usando el activatedRoute
    this.activatedRoute.params
                       .subscribe( ({id}) => this.cargarMedico( id ) );

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();

    // Creamos un observable que este pendiente del hospital
    // Para este caso el observable que usamos es el valueChanges
    this.medicoForm.get('hospital')?.valueChanges
        .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( hosp => hosp._id === hospitalId );
        });

  }

  cargarMedico( id: string ){

    if( id === 'nuevo' ){
      return;
    }

    // Si pasa de la anterior validación significa que tengo un id en teoría válido de mongo
     this.medicoService.obtenerMedicoPorId( id )
         // Para solucionar el tema de que la imágen del hospital no se alcanza a cargar debido a la rapidez con la que se hace
         // y a veces no la alcanza a detecta, lo que podemos hacer es darle una pequña espera.
         // Por lo tanto esperamos 100 milésimas de segundo antes de establecer los valores
         .pipe(
          delay( 100 )
         )
         .subscribe( medico => {

          // Si el médico no existe significa que la persona cambio el url de un médico que no existe
          // por lo tanto controlamos para que no suceda un error y lo sacamos de la pantalla
          if( !medico ){
            return this.router.navigateByUrl('/dashboard/medicos');
          }

          // NOTA: Desestructuramos para obtener los valores que necesitamos que es el nombre del médico
          //       y dentro del objeto hospital obtenemos solo el id, esto con el fin de poder establecerle 
          //       dichos valores al formulario
          const { nombre, hospital: { _id } }  = medico;
          this.medicoSeleccionado = medico;
          // Establecemos los valores al formulario
          this.medicoForm.setValue( { nombre, hospital: _id } )
          return;
         });

  }

  guardarMedico() {

    const { nombre } = this.medicoForm.value;

    if( this.medicoSeleccionado ){
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data )
          .subscribe( resp => {
            Swal.fire( 'Actualizado', `${ nombre } actualizado exitosamente`, 'success');
          })
    } else {
      // Crear
      this.medicoService.crearMedico( this.medicoForm.value )
          .subscribe( (resp: any) =>{
            Swal.fire( 'Creado', `${ nombre } creado exitosamente`, 'success');
            // Una vez creado hacemos la redirección a la misma pantalla pero con la información que estoy esperando
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
          })
    }

  }

  cargarHospitales() {

    this.hospitalService.cargarHospitales( 0 )
        .subscribe( ({ hospitales }) => {
          this.hospitales = hospitales;
        });

  }

}
