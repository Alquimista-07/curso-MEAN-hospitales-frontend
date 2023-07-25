import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

   public labels1: string[] = [ 'Pan', 'Jamón', 'Queso' ];
   
   public data1: any = [
      { data: [ 10, 15, 4 ] }
    ]

}
