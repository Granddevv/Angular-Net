import { Component, OnInit } from '@angular/core';
import { DeletedItems } from '../../models/delete-items/deleted-items.model';
import { DeletedItemsService } from '../../services/data-services/deleted-items.service';

@Component({
  selector: 'app-deleted-items',
  templateUrl: './deleted-items.component.html',
  styleUrls: ['./deleted-items.component.scss'],
  providers: [DeletedItemsService]
})
export class DeletedItemsComponent implements OnInit {
  public deletedItems: DeletedItems;

  constructor(private deletedItemsService: DeletedItemsService) {
    this.deletedItems = new DeletedItems();
  }

  ngOnInit() {
    this.deletedItemsService.getDeletedItems().subscribe(items => {
      this.deletedItems = items;
    });
  }
}
