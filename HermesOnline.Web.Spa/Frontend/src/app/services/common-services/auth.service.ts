import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthConstants } from '../../common/constants/auth.constants';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PrincipalService } from './principal.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private activatedRoute: ActivatedRouteSnapshot;
  private routerState: RouterStateSnapshot;

  constructor(
    private http: Http,
    private router: Router,
    private principalService: PrincipalService) { }

  login(username: string, password: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const payload = `grant_type=${AuthConstants.passwordGrantType}&username=${username}&password=${password}`;

    return this.http.post('/api/token', payload, { headers: headers }).toPromise()
      .then((response) => {
        const tokenResponse = response.json();
        if (tokenResponse && tokenResponse.access_token) {
          localStorage.setItem(AuthConstants.tokenLocalStorage, tokenResponse.access_token);
        }
        return this.principalService.checkIdentity(true);
      });
  }

  logout() {
    localStorage.removeItem(AuthConstants.tokenLocalStorage);
    this.principalService.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  authorizeRoutes(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.activatedRoute = route;
    this.routerState = state;

    // If user don't have tokend and tries to access page that allows anonymous access
    if (!this.hasToken() && this.activatedRoute.data['allowAnonymous']) {
      return Promise.resolve(true);
    }
    return this.principalService.checkIdentity().then(this.handleAuthorizeRoutes.bind(this));
  }

  private handleAuthorizeRoutes() {
    const isAuthenticated = this.principalService.isAuthenticated;
    let canActivate = true;

    // If user is not authenticated and tries to access page that which is not allowed to anonymous, redirect to login
    if (!isAuthenticated && !this.activatedRoute.data['allowAnonymous']) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.routerState.url } });
    }

    // If authenticated user tries to access page that allows anonymous access such as login or register, redirect to home page
    if (isAuthenticated && this.activatedRoute.data['allowAnonymous']) {
      this.router.navigate(['']);
      canActivate = false;
    }

    // If authenticated user tries to access page without permission
    if (isAuthenticated && this.activatedRoute.data['permissions'] && this.activatedRoute.data['permissions'].length > 0
      && !this.principalService.hasAnyPermissions(this.activatedRoute.data['permissions'])) {
      this.router.navigate(['']);
      canActivate = false;
    }

    return canActivate;
  }

  private hasToken(): boolean {
    if (localStorage.getItem(AuthConstants.tokenLocalStorage)) {
      return true;
    }
    return false;
  }
}
