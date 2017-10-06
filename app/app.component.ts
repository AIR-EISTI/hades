import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <nav>
    <ul>
      <li>
        Jeux
        <my-games>
        </my-games>
      </li>
      <li>
        Serveurs
        <my-servers>
        </my-servers>
      </li>
    </ul>
  </nav>
  <router-outlet></router-outlet>
  `,
})
export class AppComponent  { name = 'Angular'; }
