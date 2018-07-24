import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {
  products: Observable<any[]>; // makes interfaces for these two types
  comments: Observable<any[]>;
  private productsCollection: AngularFirestoreCollection<any>;
  private commentsCollection: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.productsCollection = this.db.collection('products');
    this.products = this.productsCollection.valueChanges();

    this.commentsCollection = this.db.collection('comments');
    this.comments = this.commentsCollection.valueChanges();
  }
}
