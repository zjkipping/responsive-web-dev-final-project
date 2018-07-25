import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { DetailsComponent } from './details/details.component';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    ProductDetailsComponent,
    DetailsComponent,
    CommentsComponent
  ]
})
export class ProductDetailsModule { }
