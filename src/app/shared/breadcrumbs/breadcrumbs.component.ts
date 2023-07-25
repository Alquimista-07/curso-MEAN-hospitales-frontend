import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo!: string;

  // NOTA: Agregamos optimización para que cuando se de logaout se destruya la suscripción y no se mantenga
  //       y gaste recursos innecesarios ya que se pueden crear varias suscripciones
  public tituloSubs$: Subscription;

  constructor( private router: Router ) { 

    this.tituloSubs$ = this.getArgumentosRuta()
                           .subscribe( ({ titulo }) => {
                              this.titulo = titulo;
                              document.title = `AdminPro - ${ titulo }`;
                           });

  }

  ngOnDestroy(): void {
    console.log('Llamo onDestoy');
    this.tituloSubs$.unsubscribe();
  }

  // Metodo para traer la información de la data definida en la el routing y el cual nos sirve
  // para asignar el titulo en el Breadcrums
  getArgumentosRuta() {

    return this.router.events
    .pipe(
      filter( (event): event is ActivationEnd => event instanceof ActivationEnd ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
      map( event => event.snapshot.data )
    );

  }

}
