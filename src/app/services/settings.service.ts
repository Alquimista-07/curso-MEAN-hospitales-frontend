import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() { 

    // Leemos el localstorage para obtener el tema y asignarlo
    const urlTheme = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';
    this.linkTheme?.setAttribute('href', urlTheme);

  }

  changeTheme( theme: string ){
    
    const urlTheme = `./assets/css/colors/${theme}.css`;

    this.linkTheme?.setAttribute('href', urlTheme);

    // Guardamos la preferencia del tema en el localstorage
    localStorage.setItem('theme', urlTheme);

    // Marcamos el check en la caja del tema
    this.checkCurrentTheme();

  }

  // Creamos un metodo para el check
  checkCurrentTheme() {

    const links = document.querySelectorAll('.selector');

    // Barremos y borramos la clase working condicionalmente
    links!.forEach( elemento => {

      elemento.classList.remove('working');
      const btnTheme = elemento.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');
      
      if( btnThemeUrl === currentTheme ){
        elemento.classList.add( 'working' );
      }

    });

  }

}
