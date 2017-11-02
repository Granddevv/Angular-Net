// tslint:disable:max-line-length

import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { CreateAnnouncementsComponent } from './dialogs/create-announcements/create-announcements.component';
import { MdDialogRef, MdDialog, MdSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { DownloadHelper } from '../../common/helpers/download.helper';
import { PreviewAnnouncementComponent } from './dialogs/preview-announcement/preview-announcement.component';
import { AnnouncementsTableRowModel, AnnouncementsTableFilterModel, Announcement } from '../../models/announcements/announcements.model';
import { AnnouncementsService } from '../../services/data-services/announcements.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  providers: [AnnouncementsService],
  encapsulation: ViewEncapsulation.None
})
export class AnnouncementsComponent implements OnInit {
  public columns = [];
  public selected = [];
  public limitPerPage = 15;
  public count = 0;
  public offset = 0;
  public dataRows: AnnouncementsTableRowModel[] = [];
  loadingIndicator: boolean;

  filter: AnnouncementsTableFilterModel;

  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;
  @ViewChild('title')
  titleTemplate: TemplateRef<any>;
  @ViewChild('description')
  descriptionTemplate: TemplateRef<any>;
  @ViewChild('fileName')
  fileNameTemplate: TemplateRef<any>;
  @ViewChild('dateHeaderTemplate')
  dateHeaderTemplate: TemplateRef<any>;
  @ViewChild('titleHeaderTemplate')
  titleHeaderTemplate: TemplateRef<any>;
  @ViewChild('descriptionHeaderTemplate')
  descriptionHeaderTemplate: TemplateRef<any>;
  @ViewChild('fileHeaderTemplate')
  fileHeaderTemplate: TemplateRef<any>;
  @ViewChild('actionHeaderTemplate')
  actionHeaderTemplate: TemplateRef<any>;

  constructor(private announcementsService: AnnouncementsService, public dialog: MdDialog, public snackBar: MdSnackBar) { }

  ngOnInit() {
    this.initializeColumns();
    this.filter = new AnnouncementsTableFilterModel();
    this.filterPage();
  }

  public openCreateDialog() {
    const dialog = this.dialog.open(CreateAnnouncementsComponent);
    dialog.afterClosed().subscribe(() => {
      this.filterPage();
    });
  }

  public edit(row) {
    const dialog = this.dialog.open(CreateAnnouncementsComponent);
    dialog.componentInstance.announcement = new Announcement(row['id'], row['title'], row['description'], row['fileName']);
    dialog.afterClosed().subscribe(() => {
      this.filterPage();
    });
  }

  public delete(row) {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent);
    confirmDialog.componentInstance.title = 'Are you sure you want to delete announcement?';
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.announcementsService.delete(row['id']).subscribe(() => {
          this.filterPage();
          const message = 'Announcement has been successfully deleted.';
          this.snackBar.open(message, '', { duration: 2000 });
        }
        );
      }
    });
  }

  private initializeColumns() {
    this.columns = [
      { name: 'Title', headerTemplate: this.titleHeaderTemplate, cellTemplate: this.titleTemplate, sortable: false, resizeable: false },
      { name: 'Description', headerTemplate: this.descriptionHeaderTemplate, cellTemplate: this.descriptionTemplate, sortable: false, resizeable: false },
      { name: 'Date', headerTemplate: this.dateHeaderTemplate, prop: 'date', sortable: true, resizeable: false },
      { name: 'File', headerTemplate: this.fileHeaderTemplate, cellTemplate: this.fileNameTemplate, prop: 'fileName', sortable: false, resizeable: false },
      { name: 'Actions', headerTemplate: this.actionHeaderTemplate, cellTemplate: this.actionsTemplate, sortable: false, resizeable: false }
    ]
  }

  public onPage(event) {
    this.filter.pageSize = event.pageSize;
    this.filter.pageIndex = event.offset;
    this.offset = event.offset;
    this.filterPage();
  }

  public onSort(event) {
    this.filter.sortProperty = event.sorts[0].prop;
    this.filter.sortDirection = event.sorts[0].dir === 'asc' ? 0 : 1;
    this.filterPage();
  }

  filterPage() {
    this.loadingIndicator = true;
    this.announcementsService.filterTable(this.filter).subscribe(data => {
      this.dataRows = data.announcementsTableRows;
      this.count = data.totalRecords;
      setTimeout(() => { this.loadingIndicator = false; }, 1000);
    });
  }

  public download(row) {
    const response = this.announcementsService.downloadAttachment(row['id']);
    DownloadHelper.downloadFileFromResponse(response);
  }

  view(row) {
    const dialog = this.dialog.open(PreviewAnnouncementComponent);
    dialog.componentInstance.announcement = new Announcement(row['id'], row['title'], row['description'], row['fileName'], row['date']);
  }
}
