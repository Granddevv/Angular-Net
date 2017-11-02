import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SpinnerService } from './spinner.service';
import { AuthConstants } from '../../common/constants/auth.constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';

@Injectable()
export class HttpService extends Http {
  constructor(backend: XHRBackend, options: RequestOptions, private spinnerService: SpinnerService, private router: Router) {
    super(backend, options);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setOptionHeaders(options);
    return super.request(url, options)
      .catch(this.catchErrors())
      .finally(() => {
        this.spinnerService.requestSpinner(false);
      });
  }

  delete(url: string, options?: RequestOptionsArgs, showSpinner = true): Observable<Response> {
    options = this.setOptionHeaders(options);
    this.spinnerService.disableSpinner(!showSpinner);
    this.spinnerService.requestSpinner(true);

    return super.delete(url, options);
  }

  get(url: string, options?: RequestOptionsArgs, showSpinner = true): Observable<Response> {
    options = this.setOptionHeaders(options);
    this.spinnerService.disableSpinner(!showSpinner);
    this.spinnerService.requestSpinner(true);

    return super.get(url, options);
  }

  post(url: string, data: any, options?: RequestOptionsArgs, showSpinner = true): Observable<Response> {
    options = this.setOptionHeaders(options);
    this.spinnerService.disableSpinner(!showSpinner);
    this.spinnerService.requestSpinner(true);

    return super.post(url, data, options);
  }

  private catchErrors() {
    return (res: Response) => {
      if ((res.status === 0 || res.status === 404) && localStorage.getItem(AuthConstants.tokenLocalStorage)) {
        localStorage.removeItem(AuthConstants.tokenLocalStorage);
        this.router.navigate(['/login']);
      }
      return Observable.throw(res);
    };
  }

  private setOptionHeaders(options: RequestOptionsArgs) {
    if (!options) {
      options = {};
    }

    options.headers = new Headers();
    options.headers.set('Authorization', `Bearer ${this.getToken()}`);
    options.headers.set('Content-Type', 'application/json');
    options.headers.set('Pragma', 'no-cache');
    options.headers.set('Cache-Control', 'no-cache');
    options.headers.set('Expires', 'Sat, 01 Dec 2001 00:00:00 GMT');

    return options;
  }

  private getToken(): string {
    return localStorage.getItem(AuthConstants.tokenLocalStorage) || '';
  }
}
