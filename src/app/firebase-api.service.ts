import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Comment, Product, User, PrivilegeLevel, Rating } from './types';
import { CartStateService } from './cart-state.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {
  products: Observable<Product[]>;
  comments: Observable<Comment[]>;
  user: Observable<User>;
  private productsCollection: AngularFirestoreCollection<Product>;
  private commentsCollection: AngularFirestoreCollection<Comment>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private cs: CartStateService) {
    this.productsCollection = this.afs.collection('products');
    this.products = this.productsCollection.valueChanges();

    this.commentsCollection = this.afs.collection('comments');
    this.comments = this.commentsCollection.valueChanges();

    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.updateUserData(credential.user, PrivilegeLevel.Admin);
        this.router.navigate(['/']);
      })
      .catch(error => {
        throw error;
      });
  }

  getProductDetails(id: string) {
    return this.afs.collection<Product>('products/').doc<Product>(id).valueChanges();
  }

  rateProduct(rating: Rating, product: Product) {
    this.afs.collection('products/').doc(product.uid).set({...product, ratings: [...product.ratings, rating]});
  }

  createNewProduct(name: string, description: string, image: string, price: number) {
    const newProduct: Product = {
      name,
      description,
      image,
      price,
      ratings: [],
      uid: this.afs.createId()
    };
    this.afs.collection('/products').add(newProduct);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user, PrivilegeLevel.General);
        this.router.navigate(['/']);
      })
      .catch(error => {
        throw error;
      });
  }

  private updateUserData(user, level) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      level: level
    };

    return userRef.set(data, { merge: true });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
      this.cs.clearCart();
    });
  }
}
