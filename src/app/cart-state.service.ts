import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Product, CartItem } from './types';

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private state: CartItem[] = [];
  cart: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.state);

  addProduct(product: Product) {
    const index = this.state.findIndex(i => i.product.uid === product.uid);
    const newState = [...this.state];
    if (index >= 0) {
      newState[index].count++;
      this.state = newState;
    } else {
      this.state = [...this.state, { product, count: 1 }];
    }
    this.cart.next(this.state);
  }

  addItem(item: CartItem) {
    const index = this.state.findIndex(i => i.product.uid === item.product.uid);
    const newState = [...this.state];
    newState[index].count++;
    this.state = newState;
    this.cart.next(this.state);
  }

  subtractItem(item: CartItem) {
    const index = this.state.findIndex(i => i.product.uid === item.product.uid);
    const newState = [...this.state];
    newState[index].count--;
    if (newState[index].count < 0) {
      newState.splice(index, 1);
    }
    this.state = newState;
    this.cart.next(this.state);
  }

  removeItem(item: CartItem) {
    const index = this.state.findIndex(i => i.product.uid === item.product.uid);
    const newState = [...this.state];
    newState.splice(index, 1);
    this.state = newState;
    this.cart.next(this.state);
  }

  clearCart() {
    this.state = [];
    this.cart.next(this.state);
  }
}
