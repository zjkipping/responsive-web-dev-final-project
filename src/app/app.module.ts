import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuard } from './auth-guard.service';
import { LoginGuard } from './login-guard.service';
import { AdminGuard } from './admin-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomeModule' },
  { path: 'products', loadChildren: './products/products.module#ProductsModule' },
  { path: 'products/:id', loadChildren: './product-details/product-details.module#ProductDetailsModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartModule', canActivate: [AuthGuard] },
  { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [LoginGuard] },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivate: [AdminGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
