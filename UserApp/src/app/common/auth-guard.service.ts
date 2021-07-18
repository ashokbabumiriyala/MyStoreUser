import { Injectable } from '@angular/core';
import { AuthenticationService } from '../common/authentication.service';
import {
  CanLoad,
  CanActivate,
  Route,
  Router,
  ActivatedRouteSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanLoad, CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canLoad(route: Route): boolean {
    const customRedirect = route.data.authGuardRedirect;
    const isUserLoggedIn = this.authenticationService.isAuthenticated;
    if (!this.authenticationService.isAuthenticated) {
      const redirect = !!customRedirect ? customRedirect : '/login';
      this.router.navigate([redirect]);
      return isUserLoggedIn;
    }
    return isUserLoggedIn;
  }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
    const customRedirect = activatedRouteSnapshot.data.authGuardRedirect;
    const isUserLoggedIn = this.authenticationService.isAuthenticated;
    if (!this.authenticationService.isAuthenticated) {
      const redirect = !!customRedirect ? customRedirect : '/login';
      this.router.navigate([redirect]);
      return isUserLoggedIn;
    }
    return isUserLoggedIn;
  }
}
