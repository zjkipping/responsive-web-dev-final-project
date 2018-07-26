import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FirebaseApiService } from '../firebase-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(private api: FirebaseApiService, fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  loginAsAdmin() {
    if (this.loginForm.valid) {
      this.api.emailLogin(this.loginForm.value.email, this.loginForm.value.password).then(e => this.error = e);
    }
  }

  loginWithGoogle() {
    this.api.googleLogin().then(e => this.error = e);
  }
}
