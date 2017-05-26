import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private auth: AuthService) { }

  signInWithWCA() {
    this.auth.openWcaOAuthPopup();
  }

  signOut() {
    this.auth.signOut();
  }
}
