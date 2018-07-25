import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    ProductDetailsRoutingModule
  ],
  declarations: [ProductDetailsComponent, DetailsComponent]
})
export class ProductDetailsModule { }
