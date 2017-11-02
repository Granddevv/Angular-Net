import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { CreateTagDialogComponent } from './dialog/create-tag-dialog/create-tag-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MdSnackBar } from '@angular/material';
import { PreviewTagComponent } from './dialog/preview-tag/preview-tag.component';
import { TagsTableFilterModel, TagsTableRowModel, Tag } from '../../models/tags/tag.model';
import { TagService } from '../../services/data-services/tag.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [TagService],
  encapsulation: ViewEncapsulation.None
})
export class TagComponent implements OnInit {
  columns = [];
  filter: TagsTableFilterModel;
  selected = [];
  limitPerPage = 15;
  count = 0;
  offset = 0;
  dataRows: TagsTableRowModel[] = [];
  @ViewChild('color') colorTemplate: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  @ViewChild('description') descriptionTemplate: TemplateRef<any>;
  @ViewChild('name') nameTemplate: TemplateRef<any>;
  loadingIndicator: boolean;

  constructor(public dialog: MdDialog, private tagService: TagService, public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new TagsTableFilterModel();
    this.filterPage();
  }

  filterPage() {
    this.loadingIndicator = true;
    this.tagService.filterTable(this.filter).subscribe(data => {
      this.dataRows = data.tagsTableRows;
      this.count = data.totalRecords;
      setTimeout(() => { this.loadingIndicator = false; }, 1000);
    });
  }

  public onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterPage();
  }

  private initializeColumns() {
    this.columns = [
      { name: 'Name', cellTemplate: this.nameTemplate, sortable: true, resizeable: false },
      { name: 'Description', cellTemplate: this.descriptionTemplate, sortable: false, width: 400, resizeable: false },
      { name: 'Date modified', prop: 'modifiedDate', sortable: true, resizeable: false },
      { name: 'Modified by', prop: 'modifiedBy', sortable: true, resizeable: false },
      { name: 'Color', cellTemplate: this.colorTemplate, sortable: false, width: 100, resizeable: false },
      { name: 'Actions', cellTemplate: this.actionsTemplate, sortable: false, width: 90, resizeable: false }
    ]
  }

  public onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterPage();
  }

  public openCreateDialog() {
    const dialog = this.dialog.open(CreateTagDialogComponent);
    dialog.afterClosed().subscribe(() => {
      this.filterPage();
    });
  }

  public edit(row) {
    const dialog = this.dialog.open(CreateTagDialogComponent);
    dialog.componentInstance.tag = new Tag(row['id'], row['name'], row['description'], row['color']);
    dialog.afterClosed().subscribe(() => {
      this.filterPage();
    });
  }

  public delete(row) {
    this.tagService.isUsed(row['id']).subscribe(isUsed => {
      const dialog = this.dialog.open(ConfirmationDialogComponent);
      dialog.componentInstance.title =
        isUsed ?
          'This tag has been assigned to some finding. Are you sure that you want to delete it anyway?'
          : 'Are you sure that you want to delete it?';
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.tagService.delete(row['id']).subscribe(() => this.filterPage());
          this.dialog.closeAll();
          const message = 'Tag has been successfully deleted.';
          this.snackBar.open(message, '', { duration: 20000 });
        }
      });
    });
  }

  public view(row) {
    const dialog = this.dialog.open(PreviewTagComponent);
    dialog.componentInstance.tag = new Tag(row['id'], row['name'], row['description'], row['color'], row['modifiedDate'], row['modifiedBy']);
  }
}
