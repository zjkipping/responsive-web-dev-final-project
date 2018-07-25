import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { FirebaseApiService } from '../firebase-api.service';
import { Product, Comment, User, Rating } from '../types';
import { CartStateService } from '../cart-state.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  product: Observable<Product>;
  comments: Observable<Comment[]>;
  rating: Observable<number>;
  rated: Observable<boolean>;
  user: Observable<User>;

  constructor(private api: FirebaseApiService, private cs: CartStateService, private route: ActivatedRoute) {
    this.comments = combineLatest(this.route.params, this.api.comments, (params, c) => ({ params, comments: c })).pipe(
      map(streams => {
        return streams.comments.filter(c => c.userID === streams.params['id']);
      })
    );
    this.product = this.route.params.pipe(
      switchMap(params => {
        return this.api.getProductDetails(params['id']);
      })
    );
    this.rating = this.product.pipe(map(product => {
      let calculated = 0;
      product.ratings.forEach(r => calculated += r.value);
      if (product.ratings.length > 0) {
        return Math.round(calculated / product.ratings.length);
      }
      return 0;
    }));
    this.rated = combineLatest(this.api.user, this.product, (user, product) => ({ user, ratings: product.ratings })).pipe(
      map(streams => {
        return !!streams.ratings.find(r => r.userID === streams.user.uid);
      })
    );
    this.user = this.api.user;
  }

  rateProduct(obj: { rating: Rating, product: Product }) {
    this.api.rateProduct(obj.rating, obj.product);
  }

  addToCart(product: Product) {
    this.cs.addProduct(product);
  }
}
