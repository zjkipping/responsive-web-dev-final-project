import { Component } from '@angular/core';
import { FirebaseApiService } from './firebase-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartCount: Observable<number>;

  constructor(public api: FirebaseApiService) {
    this.cartCount = api.cart.pipe(map(cart => {
      let count = 0;
      if (cart) {
        cart.forEach(i => count += i.count);
      }
      return count;
    }));
  }
}
