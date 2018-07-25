import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartStateService } from '../cart-state.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  totalPrice: Observable<number>;

  constructor(public cs: CartStateService) {
    this.totalPrice = cs.cart.pipe(
      map(cart => {
        let total = 0;
        cart.forEach(i => total += i.count * i.product.price);
        return total;
      })
    );
  }
}
