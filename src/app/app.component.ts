import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { FirebaseApiService } from './firebase-api.service';
import { CartStateService } from './cart-state.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartCount: Observable<number>;

  constructor(public api: FirebaseApiService, cs: CartStateService) {
    this.cartCount = cs.cart.pipe(map(cart => {
      let count = 0;
      cart.forEach(i => count += i.count);
      return count;
    }));
  }
}
