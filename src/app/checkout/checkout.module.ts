import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';

@NgModule({
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CheckoutComponent]
})
export class CheckoutModule { }
