import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        // Protegemos las rutas
        canActivate: [ AuthGuard ],
        // El canload va de la mano con el lazyload ya que este valida a través del guard para ver si tiene acceso a la ruta para posteriormente cargar
        // lo necesario y lo que se especifico en el modulo del lazyload
        canLoad: [ AuthGuard ],
        loadChildren: () => import( './child-routes.module' ).then( modulo => modulo.ChildRoutesModule )
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
