import {Component, Input} from '@angular/core';
import {faEye, faEyeSlash, faMoneyBill, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-admin-users-actions',
  template: `
    <div class="row">
      <div class="col">
        <button class="btn btn-warning btn-sm w-100" (click)="addMoney.open()">
          <fa-icon [icon]="icons.money"></fa-icon>
          Add Money
        </button>
      </div>
      <div class="col pl-0">
        <button class="btn btn-warning btn-sm w-100" (click)="toggleVisibility()">
          <fa-icon [icon]="user.hidden ? icons.eye : icons.eyeSlash"></fa-icon>
          {{user.hidden ? 'Show' : 'Hide'}} User
        </button>
      </div>
      <div class="col pl-0">
        <button class="btn btn-warning btn-sm w-100" (click)="deleteConfirm.open()">
          <fa-icon [icon]="icons.trash"></fa-icon>
          Delete User
        </button>
      </div>
    </div>
    <app-admin-user-add-money #addMoney [user]="user" [refresh]="refresh"></app-admin-user-add-money>
    <app-admin-confirmation-modal #deleteConfirm [callback]="deleteUser">
      Do you really want to <strong>permanently delete</strong> {{user.name}}?<br>
      They won't be able to order drinks anymore and their balance will be deleted.<br>
      Past transactions by this user will remain in the database.
    </app-admin-confirmation-modal>
  `,
  styles: []
})
export class AdminUsersActionsComponent {
  @Input() user!: User;

  @Input() refresh!: () => void;

  // FontAwesome icons
  icons = {
    money: faMoneyBill,
    eye: faEye,
    eyeSlash: faEyeSlash,
    trash: faTrashAlt,
  };

  constructor(
    private userService: UserService,
  ) {
  }

  deleteUser = () => {
    this.userService.deleteUser(this.user).subscribe(response => {
      if (response.status === 200) {
        this.refresh();
      }
    });
  };

  toggleVisibility(): void {
    this.userService.toggleVisibility(this.user).subscribe(response => {
      if (response.status === 200) {
        this.refresh();
      }
    });
  }
}
