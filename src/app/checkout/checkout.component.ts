import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FirebaseApiService } from '../firebase-api.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  checkoutForm: FormGroup;

  constructor(private api: FirebaseApiService, private router: Router, fb: FormBuilder) {
    this.checkoutForm = fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  checkOut() {
    if (this.checkoutForm.valid) {
      this.checkoutForm.reset();
      this.api.clearCart();
      this.router.navigate(['/home']);
    }
  }
}
