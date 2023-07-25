import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { filter, map, retry, take } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() { 

    // Nos subscribimos al observable
    // Implementamos el rety el cual permite relanzar el observable cuantas veces creamos necesario
    // y de esta manera reintentar la ejecución de un bloque de codigo que pudo fallar por algún motivo
    this.retornaObservable().pipe(
      // retry() // Intenta infinitas veces
      retry(2) // Reintenta 2 veces
    ).subscribe(
      valor => console.log('Subs', valor),
      // Cunado se complete hacemos algo
      (error) => console.error('Error: ', error),
      () => console.info('Obs Completado')
      
    );

    this.intervalSubs = this.retornaIntervalo()
        .subscribe(
          (valor) => console.log( 'valor: ', valor )
        );

  }

  ngOnDestroy(): void {
    // El metodo unsubscribe lo deberíamos llamar con observables que siempre esten emitiendo valores
    // para evitar consunsumo en segundo plano de recursos los cuales pueden causar mal rendimiento en
    // nuestra aplicación.
    this.intervalSubs.unsubscribe();
  }

  // NOTA: Más información sobre operadores de rxjs: https://reactivex.io/documentation/operators.html

  // Cremos un metodo el cual es un observable con un intervalo usando rxjs
  retornaIntervalo(): Observable<number | string> {

    return interval(1000)
           .pipe(
            //  take(10),
             // map( valor => { return valor + 1 } )
             // map( valor => valor + 1 )
            //  map( valor => { return 'Hola Mundo!!!... ' + valor } ),
             map( valor => valor + 1 ),
             filter( valor => (valor % 2 === 0 ? true: false) ),
            //  take(10)
           );

  }

  // Creamos un método que regrese un observable
  retornaObservable(): Observable<number> {

    let i = -1;

    // Creamos un observable de manera manual
    return new Observable<number>( observer => {

      const intervalo = setInterval( () =>{

        i++;
        // Emitimos el valor de i
        observer.next(i);

        // Finalizamos el observable
        if ( i === 4 ){
          clearInterval(intervalo);
          // Notificamos que ya se cancelo
          observer.complete();
        }

        if( i === 2 ){
          i = 0;
          // console.log('i = 2... error!!!...');
          // NOTA: Una vez se dispara el error el complete no sigue
          observer.error('i llego al valor de 2');
        }

      }, 1000 );

    });

  }

}
