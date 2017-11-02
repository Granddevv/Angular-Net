import { Component, OnInit, Output, OnDestroy, Input, AfterViewInit, AfterContentChecked, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { UserActivityRequest } from '../models/user-activity/user-activity.model';
import { SpinnerService } from '../services/common-services/spinner.service';
import { UserActivityService } from '../services/data-services/user-activity.service';

@Component({
  selector: 'app-manager-view',
  templateUrl: 'manager-view.component.html',
  styleUrls: ['./manager-view.component.scss']
})
export class ManagerViewComponent implements OnInit, OnDestroy {

  showSpinner: boolean;
  disableSpinner = false;
  isSearchBy = false;
  requestCnt = 0;
  private subscription: any;

  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    public route: ActivatedRoute,
    private userActivityService: UserActivityService,
    private cdRef: ChangeDetectorRef) {
    this.showSpinner = false;
    this.router = router;
  }

  ngOnInit() {
    this.handleSpiner();
    this.handleDefaultRoute();
    this.manageUserActivity();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private handleSpiner() {
    this.spinnerService.loaderStatusEmmiter.subscribe((val: boolean) => {
      if (val === true) {
        this.requestCnt++;
      } else if (val === false) {
        this.requestCnt--;
      }

      this.showSpinner = this.requestCnt > 0;
    });

    this.spinnerService.hideSpinnerEmmiter.subscribe((val: boolean) => {
      this.disableSpinner = val;
    });

    this.spinnerService.routeName.subscribe((routeName: string) => {
      if (routeName === 'searchBy') {
        this.isSearchBy = true;
      } else {
        this.isSearchBy = false;
      }
    });

    this.cdRef.detectChanges();
  }

  public isSpinnerShown(): boolean {
    return this.showSpinner && !this.disableSpinner;
  }

  private handleDefaultRoute() {
    // TODO
    // Redirection on 'search by' page as default when /managerview route is active
    // This is workaround for now
    if (this.route.snapshot.children.length === 0) {
      this.router.navigateByUrl('/managerview/(filter:searchby)');
    }
  }

  public manageUserActivity() {
    let userActivityRequest: UserActivityRequest;

    this.subscription = this.router.events.filter(e => e instanceof NavigationEnd).subscribe((e) => {
      const findingsActivatedRoute = this.route.snapshot.children.find(x => x.outlet === 'findings');
      const filterActivatedRoute = this.route.snapshot.children.find(x => x.outlet === 'filter');
      if (findingsActivatedRoute && findingsActivatedRoute.params) {
        userActivityRequest = {
          url: e['url'],
          nodeType: findingsActivatedRoute.params['type'],
          nodeId: findingsActivatedRoute.params['id'],
          tabView: findingsActivatedRoute.params['tabId'],
          rowId: filterActivatedRoute.params['findingId']
        };
        this.userActivityService.saveUserActivity(userActivityRequest).subscribe();
      }
    });
  }
}
