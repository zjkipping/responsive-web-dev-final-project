import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Comment, Product } from './types';


@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {
  products: Observable<Product[]>;
  comments: Observable<Comment[]>;
  private productsCollection: AngularFirestoreCollection<Product[]>;
  private commentsCollection: AngularFirestoreCollection<Comment[]>;

  constructor(private db: AngularFirestore) {
    this.productsCollection = this.db.collection('products');
    this.products = this.productsCollection.valueChanges();

    this.commentsCollection = this.db.collection('comments');
    this.comments = this.commentsCollection.valueChanges();
  }
}
