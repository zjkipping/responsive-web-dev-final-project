import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
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

  constructor() {
    this.mobile = window.innerWidth > 700 ? false : true;
  }

  logout() {
    this.loggedIn = false;
  }

  login() {
    this.loggedIn = true;
  }
}
