import {Component, Input, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-admin-user-add',
  template: `
    <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Add User</h4>
        <button type="button" class="close" (click)="modal.dismiss()">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form #form="ngForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" ngbAutofocus [(ngModel)]="username" [required]="true" name="name">
          </div>
        </form>
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-success" [disabled]="busy || form.invalid"
                (click)="addUser()">{{busy ? 'Adding...' : 'Add'}}</button>
      </div>
    </ng-template>
  `,
  styles: []
})
export class AdminUserAddComponent {
  @Input() refresh!: () => void;

  @ViewChild('content', {static: true}) content: any;

  username = '';

  busy = false;
  modal: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
  ) {
  }

  open(): void {
    if (this.modalService.hasOpenModals()) {
      return;
    }
    this.username = '';
    this.modal = this.modalService.open(this.content);
  }

  addUser(): void {
    this.busy = true;
    this.userService.addUser(this.username).subscribe(response => {
      if (response.status === 200) {
        this.modal?.close();
        this.busy = false;
        this.refresh();
      }
    });
  }

}
