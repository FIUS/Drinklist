import {Component, Input, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BeverageService} from '../../../services/beverage.service';
import {Beverage} from '../../../models/beverage';

@Component({
  selector: 'app-admin-new-beverage-modal',
  template: `
    <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Add Beverage</h4>
        <button type="button" class="close" (click)="modal.dismiss()">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form #form="ngForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" ngbAutofocus [required]="true" [(ngModel)]="beverage.name" name="name">
          </div>
          <div class="form-group">
            <label for="price">Price (cents)</label>
            <input type="number" class="form-control" [(ngModel)]="beverage.price" name="price">
          </div>
          <div class="form-group">
            <label for="stock">Stock</label>
            <input type="number" class="form-control" [(ngModel)]="beverage.stock" name="stock">
          </div>
        </form>
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-success" [disabled]="busy || form.invalid"
                (click)="addBeverage()">{{busy ? 'Adding...' : 'Add'}}</button>
      </div>
    </ng-template>
  `,
  styles: []
})
export class AdminNewBeverageModalComponent {
  @Input() refresh!: () => void;

  @ViewChild('content', {static: true}) content: any;

  beverage: Beverage = Beverage.newEmpty();

  busy = false;
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
    this.beverage = Beverage.newEmpty();
    this.modal = this.modalService.open(this.content);
  }

  addBeverage(): void {
    this.busy = true;
    this.beverageService.addBeverage(this.beverage).subscribe(response => {
      if (response.status === 200) {
        this.modal?.close();
        this.busy = false;
        this.refresh();
      }
    });
  }
}
