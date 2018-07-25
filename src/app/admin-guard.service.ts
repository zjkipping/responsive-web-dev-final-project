import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { FirebaseApiService } from './firebase-api.service';
import { PrivilegeLevel } from './types';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private api: FirebaseApiService, private router: Router) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.api.user.pipe(
        take(1),
        map(user => {
          if (!user) {
            return false;
          } else {
            if (user.level === PrivilegeLevel.Admin) {
              return true;
            } else {
              return false;
            }
          }
        }),
        tap(loggedIn => {
            if (!loggedIn) {
              this.router.navigate(['/login']);
            }
        })
      );
  }
}
