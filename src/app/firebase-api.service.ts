import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, filter, map, tap} from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Comment, Product, User, PrivilegeLevel, Rating, CartItem } from './types';

@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {
  products: Observable<Product[]>;
  comments: Observable<Comment[]>;
  user: Observable<User>;
  cart: Observable<CartItem[]>;
  users: Observable<User[]>;

  private userID = '';
  private productsCollection: AngularFirestoreCollection<Product>;
  private commentsCollection: AngularFirestoreCollection<Comment>;
  private usersCollection: AngularFirestoreCollection<User>;
  private redirectRoute = '/';

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
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
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges().pipe(tap(u => this.userID = u.uid));
        } else {
          return of(null);
        }
      })
    );

    this.cart = this.user.pipe(filter(user => !!user), map(user => user.cart));
  }

  setRedirectRoute() {
    this.redirectRoute = this.router.url;
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  async emailLogin(email: string, password: string) {
    try {
      const credentials = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.updateAdminUserData(credentials.user);
      this.router.navigate([this.redirectRoute]);
      this.redirectRoute = '/';
      return '';
    } catch {
      return 'Failed to login. Please verify your email and password are correct.';
    }
  }

  getProductDetails(id: string) {
    return this.afs.collection<Product>('products/').doc<Product>(id).valueChanges();
  }

  async rateProduct(rating: Rating, product: Product) {
    const docRef = this.afs.firestore.collection('products/').doc(product.uid);
    try {
      await this.afs.firestore.runTransaction(transaction => {
        return transaction.get(docRef).then(sfDoc => {
          const newRatings = [...sfDoc.data().ratings, rating];
          transaction.update(docRef, { ratings: newRatings });
        });
      });
      return true;
    } catch {
      return false;
    }
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

  async addToCart(id: string) {
    if (this.userID) {
      const userRef = this.afs.firestore.doc(`users/${this.userID}`);
      try {
        await this.afs.firestore.runTransaction(transaction => {
          return transaction.get(userRef).then(sfDoc => {
            const productIndex = (sfDoc.data().cart as CartItem[]).findIndex(i => i.productID === id);
            const newCart = [...sfDoc.data().cart];
            if (productIndex >= 0) {
              newCart[productIndex].count++;
            } else {
              newCart.push({ count: 1, productID: id });
            }
            transaction.update(userRef, { cart: newCart });
          });
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  async subtractFromCart(id: string) {
    if (this.userID) {
      const userRef = this.afs.firestore.doc(`users/${this.userID}`);
      try {
        await this.afs.firestore.runTransaction(transaction => {
          return transaction.get(userRef).then(sfDoc => {
            const productIndex = (sfDoc.data().cart as CartItem[]).findIndex(i => i.productID === id);
            const newCart = [...sfDoc.data().cart];
            if (productIndex >= 0) {
              newCart[productIndex].count--;
              transaction.update(userRef, { cart: newCart });
            }
          });
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  async removeFromCart(id: string) {
    if (this.userID) {
      const userRef = this.afs.firestore.doc(`users/${this.userID}`);
      try {
        await this.afs.firestore.runTransaction(transaction => {
          return transaction.get(userRef).then(sfDoc => {
            const productIndex = (sfDoc.data().cart as CartItem[]).findIndex(i => i.productID === id);
            const newCart = [...sfDoc.data().cart];
            if (productIndex >= 0) {
              newCart.splice(productIndex, 1);
              transaction.update(userRef, { cart: newCart });
            }
          });
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  async clearCart() {
    if (this.userID) {
      const userRef = this.afs.firestore.doc(`users/${this.userID}`);
      try {
        await this.afs.firestore.runTransaction(transaction => {
          return transaction.get(userRef).then(sfDoc => {
            transaction.update(userRef, { cart: [] });
          });
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  private async oAuthLogin(provider) {
    try {
      const credentials = await this.afAuth.auth.signInWithPopup(provider);
      this.updateGeneralUserData(credentials.user);
      this.router.navigate([this.redirectRoute]);
      this.redirectRoute = '/';
      return '';
    } catch {
      return 'Failed to login using Google Auth. Please try again later.';
    }
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
    });
  }
}
