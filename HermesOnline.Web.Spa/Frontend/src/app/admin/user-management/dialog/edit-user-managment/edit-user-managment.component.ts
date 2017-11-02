import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { UserManagementTableRowModel } from '../../../../models/users-management/user-management-table.model';
import { UserManagementService } from '../../../../services/data-services/user-management.service';
import { BaseDialog } from '../../../../common/component-framework/base-dialog';

@Component({
  selector: 'app-edit-user-managment.component',
  templateUrl: './edit-user-managment.component.html',
  styleUrls: ['./edit-user-managment.component.scss'],
  providers: [UserManagementService]
})

export class EditUserManagmentComponent extends BaseDialog implements OnInit {
  public userManagementTableRowModel = new UserManagementTableRowModel();
  public groups = [];
  isSubmitted: boolean;
  loading = false;

  constructor(private userManagementService: UserManagementService, 
  public dialog: MdDialog, 
  public snackBar: MdSnackBar) {
    super();
  }

  ngOnInit() {
    this.userManagementService.getAllGroups().subscribe(groups => this.groups = groups);
  }

  sendUsermanagmentData(event) {
    this.loading = true;
    this.isSubmitted = true;
    this.userManagementService.editUserManagment(this.userManagementTableRowModel).subscribe(() => {
      this.loading = false;
      this.dialog.closeAll();
      const message = 'Your user management has been submitted!';
      this.snackBar.open(message, '', { duration: 2000 });
    });
  }

  validatePhoneNumber(event) {
    var key = window.event ? event.keyCode : event.which;
    if ((this.userManagementTableRowModel.phoneNumber.length === 0 && key === 43) || (key > 47 && key < 58)) {
      return true;
    } else {
      return false;
    }
  }
}