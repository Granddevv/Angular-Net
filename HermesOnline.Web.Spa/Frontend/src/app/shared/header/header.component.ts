// tslint:disable:max-line-length

import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ChangePasswordDialogComponent } from '../../shared/change-password-dialog/change-password-dialog.component';
import { AddDeepZoomLinkComponent } from '../../manager-view/findings-overview/deep-zoom-link/dialogs/add-deep-zoom-link/add-deep-zoom-link.component';
import { ImportFindingsComponent } from '../../shared/import-findings/import-findings.component';
import { Router } from '@angular/router';
import { DeleteDataComponent } from '../../admin/delete-data/delete-data';
import { Permissions } from '../../models/common/permissions.enum';
import { AuthService } from "../../services/common-services/auth.service";
import { AccountService } from '../../services/data-services/account.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    public userName: string;
    public Permissions = Permissions;

    constructor(private loginService: AuthService, private accountService: AccountService, private dialog: MdDialog, private router: Router) { }

    ngOnInit() {
        this.accountService.getUserName().subscribe(userName => {
            this.userName = userName;
        });
    }

    logout() {
        this.loginService.logout();
    }

    changePassword() {
        this.dialog.open(ChangePasswordDialogComponent, { disableClose: true });
    }

    addDeepZoomLink() {
        this.dialog.open(AddDeepZoomLinkComponent, { disableClose: true });
    }

    importFindings() {
        this.dialog.open(ImportFindingsComponent, { disableClose: true });
    }

    navigateToManagerView() {
        this.router.navigateByUrl('/managerview/(filter:searchby)');
    }

    deleteData() {
        this.dialog.open(DeleteDataComponent, { disableClose: true });
    }
}
