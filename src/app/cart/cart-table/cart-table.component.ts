import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CartItem, Product } from '../../types';
import { FirebaseApiService } from '../../firebase-api.service';

@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.css']
})
export class CartTableComponent {
  @Input() cart: CartItem[] = [];
  @Input() products: Product[] = [];
  @Input() totalPrice = 0;
  @Output() add = new EventEmitter<string>();
  @Output() subtract = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  constructor(api: FirebaseApiService) {}

  getProduct(id: string) {
    if (this.products) {
      return this.products.find(p => p.uid === id);
    }
  }
}
