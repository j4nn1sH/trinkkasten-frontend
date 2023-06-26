import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ShopService } from './shop.service';

@Injectable({
  providedIn: 'root'
})
export class RestrictedGuard implements CanActivate {
  managers: String[] = [];

  constructor(
    private authService: AuthenticationService,
    private shopService: ShopService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.shopService.isManager(route.paramMap.get('kitchen')!).pipe(
        map(data => !!data),
        tap(data => {
          if(!data) {
            this.router.navigateByUrl('./?Hilfe');
            return false
          }
          return true
        })
      );
  }
}
