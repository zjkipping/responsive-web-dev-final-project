import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Comment, Product, User, PrivilegeLevel, Rating } from './types';
import { CartStateService } from './cart-state.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {
  products: Observable<Product[]>;
  comments: Observable<Comment[]>;
  user: Observable<User>;
  users: Observable<User[]>;

  private productsCollection: AngularFirestoreCollection<Product>;
  private commentsCollection: AngularFirestoreCollection<Comment>;
  private usersCollection: AngularFirestoreCollection<User>;
  private redirectRoute = '/';

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private cs: CartStateService
  ) {
    this.productsCollection = this.afs.collection('products');
    this.products = this.productsCollection.valueChanges();

    this.commentsCollection = this.afs.collection('comments');
    this.comments = this.commentsCollection.valueChanges();

    this.usersCollection = this.afs.collection('users');
    this.users = this.usersCollection.valueChanges();

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

  setRedirectRoute() {
    this.redirectRoute = this.router.url;
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.updateAdminUserData(credential.user);
        this.router.navigate([this.redirectRoute]);
        this.redirectRoute = '/';
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

  postComment(comment: Comment) {
    this.commentsCollection.add(comment);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateGeneralUserData(credential.user);
        this.router.navigate([this.redirectRoute]);
        this.redirectRoute = '/';
      })
      .catch(error => {
        throw error;
      });
  }

  private updateGeneralUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      level: PrivilegeLevel.General
    };

    return userRef.set(data, { merge: true });
  }

  private updateAdminUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: 'Admin',
      photoURL: 'https://assets.dryicons.com/uploads/icon/svg/5610/fff0263a-8f19-4b74-8f3d-fc24b9561a96.svg',
      level: PrivilegeLevel.Admin
    };

    return userRef.set(data, { merge: true });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      if (this.router.url.includes('cart') || this.router.url.includes('checkout') || this.router.url.includes('admin')) {
        this.router.navigate(['/']);
      }
      this.cs.clearCart();
    });
  }
}
