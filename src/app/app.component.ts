import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private auth: AuthService) { }

  signInWithWCA() {
    this.auth.openWcaOAuthPopup();
  }

  signOut() {
    this.auth.signOut();
  }
}
