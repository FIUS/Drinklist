import {Component, Input, ViewChild} from '@angular/core';
import {Beverage} from '../../../models/beverage';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BeverageService} from '../../../services/beverage.service';
import {Util} from '../../../util';

@Component({
  selector: 'app-admin-beverage-edit-price-modal',
  template: `
    <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Edit price of {{beverage.name}}</h4>
        <button type="button" class="close" (click)="modal.dismiss()">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="stock">New price (in cents):</label>
          <input #input="ngModel" class="form-control" type="number" ngbAutofocus [(ngModel)]="newPrice">
        </div>
        {{beverage.name}}'s new price will be <strong>{{moneyFormat(newPrice)}}</strong>.
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-success" [disabled]="busy || input.pristine"
                (click)="updatePrice()">{{ busy ? 'Saving...' : 'Save' }}</button>
      </div>
    </ng-template>
  `,
  styles: []
})
export class AdminBeverageEditPriceModalComponent {
  @Input() beverage!: Beverage;

  @Input() refresh!: () => void;

  @ViewChild('content', {static: true}) content: any;

  busy = false;
  newPrice!: number;

  moneyFormat = Util.moneyFormat;

  private modal: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private beverageService: BeverageService,
  ) {
  }

  open(): void {
    if (this.modalService.hasOpenModals()) {
      return;
    }
    this.newPrice = this.beverage.price;
    this.modal = this.modalService.open(this.content);
  }

  updatePrice(): void {
    this.busy = true;
    this.beverageService.updatePrice(this.beverage, this.newPrice).subscribe(response => {
      if (response.status === 200) {
        this.modal?.close();
        this.busy = false;
        this.refresh();
      }
    });
  }

}
