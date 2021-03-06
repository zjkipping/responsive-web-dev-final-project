import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';

import { FirebaseApiService } from '../firebase-api.service';
import { Product, Comment, User, Rating } from '../types';

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
  users: Observable<User[]>;

  constructor(private api: FirebaseApiService, private route: ActivatedRoute) {
    this.product = this.route.params.pipe(
      switchMap(params => {
        return this.api.getProductDetails(params['id']);
      })
    );
    this.comments = combineLatest(this.product, this.api.comments, (product, c) => ({ product, comments: c })).pipe(
      filter(streams => !!streams.product),
      map(streams => {
        return streams.comments.filter(c => c.productID === streams.product.uid);
      })
    );
    this.rating = this.product.pipe(filter(product => !!product), map(product => {
      let calculated = 0;
      product.ratings.forEach(r => calculated += r.value);
      if (product.ratings.length > 0) {
        return Math.round(calculated / product.ratings.length);
      }
      return 0;
    }));
    this.rated = combineLatest(this.api.user, this.product, (user, product) => ({ user, product })).pipe(
      filter(streams => !!streams.user || !!streams.product),
      map(streams => {
        if (streams.user) {
          return !!streams.product.ratings.find(r => r.userID === streams.user.uid);
        }
        return false;
      })
    );
    this.user = this.api.user;
    this.users = this.api.users;
  }

  rateProduct(obj: { rating: Rating, product: Product }) {
    this.api.rateProduct(obj.rating, obj.product);
  }

  addToCart(product: Product) {
    this.api.addToCart(product.uid);
  }

  postComment(comment: Comment) {
    this.api.postComment(comment);
  }
}
