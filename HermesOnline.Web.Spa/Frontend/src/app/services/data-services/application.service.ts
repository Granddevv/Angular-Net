import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';

@Injectable()
export class ApplicationService {
  private readonly urlBase = '/api/application';

  constructor(private http: HttpService) { }

  public GetVersion(): Observable<string> {
    return this.http.get(`${this.urlBase}/version`, null, false).map(response => response.json());
  }
}
