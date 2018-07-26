import { Component } from '@angular/core';

import { FirebaseApiService } from '../firebase-api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  constructor(public api: FirebaseApiService) { }
}
