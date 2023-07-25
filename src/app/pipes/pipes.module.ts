import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';

// Modulo para centralizar los pipes

@NgModule({
  declarations: [
    ImagenPipe
  ],
  exports: [
    ImagenPipe
  ],
  imports: [
  ]
})
export class PipesModule { }
