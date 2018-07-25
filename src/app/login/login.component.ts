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

  constructor(private api: FirebaseApiService, fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  loginAsAdmin() {
    this.api.emailLogin(this.loginForm.value.email, this.loginForm.value.password);
  }

  loginWithGoogle() {
    this.api.googleLogin();
  }
}
