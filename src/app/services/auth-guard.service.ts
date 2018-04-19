import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  public constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // If user is trying to access post edit.
    if (route.paramMap.get('actionToPerform') == 'edit') {
      let postId = route.paramMap.get('postId');
      return this.authService.userIsSignedWithId(postId);
    }

    // No user is logged in.
    if (!this.authService.aUserIsSigned()) {
      this.router.navigate(['/sign-in']);
      return false;
    }

    return true;
  }
}
