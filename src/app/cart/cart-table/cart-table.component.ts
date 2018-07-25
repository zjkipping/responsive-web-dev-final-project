import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CartItem } from '../../types';

@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.css']
})
export class CartTableComponent {
  @Input() cart: CartItem[];
  @Input() totalPrice = 0;
  @Output() add = new EventEmitter<CartItem>();
  @Output() subtract = new EventEmitter<CartItem>();
  @Output() remove = new EventEmitter<CartItem>();

  constructor() {}

}
