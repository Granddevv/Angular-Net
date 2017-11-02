import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { DeletedItems } from '../../models/delete-items/deleted-items.model';

@Injectable()
export class DeletedItemsService {
  private readonly urlBase = '/api/deletedItems';

  constructor(private http: HttpService) { }

  getDeletedItems(): Observable<DeletedItems> {
    return this.http.get(this.urlBase).map(data => data.json());
  }
}
