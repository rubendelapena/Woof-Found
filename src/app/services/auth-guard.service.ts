import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  public constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // If user is trying to access post edit.
    if (route.paramMap.get('actionToPerform') == 'edit') {
      let userId = route.paramMap.get('userId');

      if(this.authService.userIsSignedWithId(userId)) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    }

    // No user is logged in.
    if (!this.authService.aUserIsSigned()) {
      this.authService.redirect = state.url;
      this.router.navigate(['/sign-in']);
      return false;
    }

    return true;
  }
}
