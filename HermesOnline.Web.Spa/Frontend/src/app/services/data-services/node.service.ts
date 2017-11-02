import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { IdText } from '../../models/shared/idtext';

@Injectable()
export class NodeService {
  private readonly urlBase = '/api/node';

  constructor(private http: HttpService) { }

  getFleets(): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/fleets`).map(response => response.json());
  }

  getInspections(turbineId: string): Observable<Array<IdText>> {
    return this.http.get(`${this.urlBase}/inspections/${turbineId}`).map(response => response.json());
  }

  deleteTurbine(turbineId: string) {
    return this.http.delete(`${this.urlBase}/deleteTurbine/${turbineId}`);
  }

  deleteInspection(inspectionId: string, turbineId: string) {
  return this.http.delete(`${this.urlBase}/deleteInspection/${turbineId}/${inspectionId}`);
}
}
