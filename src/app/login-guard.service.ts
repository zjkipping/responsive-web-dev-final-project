import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { FirebaseApiService } from './firebase-api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private api: FirebaseApiService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.api.user.pipe(
        take(1),
        map(user => !user),
        tap(loggedIn => {
          if (!loggedIn) {
            this.router.navigate(['/']);
          }
        })
      );
  }
}
