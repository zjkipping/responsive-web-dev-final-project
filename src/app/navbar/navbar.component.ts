import { Component, HostListener, Input } from '@angular/core';

import { FirebaseApiService } from '../firebase-api.service';
import { User } from '../types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() user: User;
  @Input() cartCount: number;

  loggedIn = true;
  mobile: boolean;
  toggle = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 700 && this.mobile) {
      this.toggle = false;
      this.mobile = false;
    } else if (event.target.innerWidth < 700 && !this.mobile) {
      this.mobile = true;
    }
  }

  constructor(private api: FirebaseApiService) {
    this.mobile = window.innerWidth > 700 ? false : true;
  }

  logout() {
    this.api.signOut();
  }

  login() {
    this.api.setRedirectRoute();
    this.api.googleLogin();
  }
}
