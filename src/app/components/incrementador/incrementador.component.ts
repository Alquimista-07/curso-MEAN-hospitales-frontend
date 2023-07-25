import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {


  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`;
  }

  @Input('valorProgreso') progreso: number = 50;
  @Input() btnClass: string = 'btn-primary';

  // Con el output escuchamos cambios que el componente incrementador va a poder emitir
  // Adicionalmente estos @Output usuarlmente son de tipo eventEmiter, es decir una fucnión
  // que el componente padre va a poder ejecutar
  @Output('valorProgreso') valorSalida: EventEmitter<number> = new EventEmitter();

  cambiarValor( valor: number ) {

    if( this.progreso >= 100 && valor >= 0 ){
      this.valorSalida.emit( 100 );
      return this.progreso = 100
    }
    
    if( this.progreso <= 0 && valor <= 0 ){
      this.valorSalida.emit( 0 );
      return this.progreso = 0
    }
    
    
    this.progreso = this.progreso + valor;
    return this.valorSalida.emit( this.progreso )

  }

  onChange( nuevoValor: number ){

    if( nuevoValor >= 100 ){
      this.progreso = 100;
    }
    else if( nuevoValor <= 0 ){
      this.progreso = 0;
    }
    else{
      this.progreso = nuevoValor;
    }
    
    this.valorSalida.emit( this.progreso );
  
  }

}
