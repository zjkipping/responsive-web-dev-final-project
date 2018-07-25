import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CartStateService } from '../cart-state.service';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  checkoutForm: FormGroup;

  constructor(private cs: CartStateService, private router: Router, fb: FormBuilder) {
    this.checkoutForm = fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  checkOut() {
    if (this.checkoutForm.valid) {
      this.checkoutForm.reset();
      this.cs.clearCart();
      this.router.navigate(['/home']);
    }
  }
}
