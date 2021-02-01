import {Component, Input, ViewChild} from '@angular/core';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Util} from '../../../util';

@Component({
  selector: 'app-admin-user-add-money',
  template: `
    <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Add money to {{user.name}}</h4>
        <button type="button" class="close" (click)="modal.dismiss()">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form #form="ngForm">
          <div class="form-group">
            <label for="money">Money to add (in cents):</label>
            <input class="form-control" ngbAutofocus type="number" name="money" [required]="true" [(ngModel)]="moneyToAdd">
          </div>
          <div class="form-group">
            <label for="reason">Reason:</label>
            <input class="form-control" type="text" name="reason" placeholder="Cash deposit" [required]="true" [(ngModel)]="reason">
          </div>
        </form>
        Adding {{moneyFormat(moneyToAdd)}} to {{user.name}}'s balance.<br>
        Their resulting balance will be <strong>{{moneyFormat(user.balance + moneyToAdd)}}</strong>.
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-success" [disabled]="busy || form.invalid || moneyToAdd === 0"
                (click)="updateBalance()">{{ busy ? 'Saving...' : 'Save' }}</button>
      </div>
    </ng-template>
  `,
  styles: []
})
export class AdminUserAddMoneyComponent {
  @Input() user!: User;

  @Input() refresh!: () => void;

  @ViewChild('content', {static: true}) content: any;

  moneyToAdd = 0;
  reason = '';
  busy = false;

  // Aliases for template access
  moneyFormat = Util.moneyFormat;

  private modal: NgbModalRef | undefined;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
  ) {
  }

  open(): void {
    if (this.modalService.hasOpenModals()) {
      return;
    }
    this.moneyToAdd = 0;
    this.reason = '';
    this.modal = this.modalService.open(this.content);
  }

  updateBalance(): void {
    if (this.moneyToAdd === 0 || this.reason === '') {
      return;
    }
    this.busy = true;
    this.userService.updateBalance(this.user, this.moneyToAdd, this.reason).subscribe(response => {
      if (response.status === 200) {
        this.modal?.close();
        this.busy = false;
        this.refresh();
      }
    });
  }

}
