import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CheckoutComponent]
})
export class CheckoutModule { }
