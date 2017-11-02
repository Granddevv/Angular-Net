import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserActivityTableRowModel } from '../../models/user-activity/user-activity.model';
import { UserActivityService } from '../../services/data-services/user-activity.service';

@Component({
  selector: 'app-useractivities',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss'],
  providers: [UserActivityService],
  encapsulation: ViewEncapsulation.None
})
export class UserActivityComponent implements OnInit {
  public columns = [
    { name: 'View Type', prop: 'viewType', sortable: false, resizeable: false },
    { name: 'Viewed On', prop: 'viewedOn', sortable: false, resizeable: false },
    { name: 'Path', prop: 'path', sortable: false, resizeable: false }
  ];

  public selected = [];
  public dataRows: UserActivityTableRowModel[] = [];
  loadingIndicator: boolean;
  constructor(private userActivityService: UserActivityService, private router: Router) { }

  ngOnInit() {
    this.loadingIndicator = true;
    this.userActivityService.getUserActivities().subscribe(rows => {
      this.dataRows = rows;
      setTimeout(() => { this.loadingIndicator = false; }, 1000);
    });
  }

  onSelect({ selected }) {
    this.router.navigateByUrl(selected[0].urlFilter);
  }
}
