import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

// Para que typescript no marque error ya que sabemos que la
// función existe de manera global hacemos lo siguiente:
declare function customInitFunctions(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor( private settingsService: SettingsService, private sidebarService: SidebarService ) { }

  ngOnInit(): void {
    // Llamamos la función global que inicializa todo
    customInitFunctions();
    // Llamamos la función que carga el menu y que valida las opciones que tiene que cargar según el role del usuario
    this.sidebarService.cargarMenu();
  }

}
