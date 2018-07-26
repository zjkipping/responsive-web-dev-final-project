import { Component } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirebaseApiService } from '../firebase-api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  totalPrice: Observable<number>;

  constructor(public api: FirebaseApiService) {
    this.totalPrice = combineLatest(api.cart, api.products, (cart, products) => ({ cart, products })).pipe(
      map(streams => {
        let total = 0;
        streams.cart.forEach(i => {
          const product = streams.products.find(p => i.productID === p.uid);
          if (product) {
            total += product.price * i.count;
          }
        });
        return total;
      })
    );
  }
}
