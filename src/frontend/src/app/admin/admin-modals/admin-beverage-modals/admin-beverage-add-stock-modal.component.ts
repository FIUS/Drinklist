import {Component, Input, ViewChild} from '@angular/core';
import {Beverage} from '../../../models/beverage';
import {BeverageService} from '../../../services/beverage.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-beverage-add-stock-modal',
  template: `
    <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Add Stock to {{beverage.name}}</h4>
        <button type="button" class="close" (click)="modal.dismiss()">
          <span>&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="stock">Stock to add:</label>
          <input class="form-control" type="number" ngbAutofocus [(ngModel)]="stockToAdd">
        </div>
        {{beverage.name}} currently has {{beverage.stock}} units in stock.<br/>
        The new stock will be <strong>{{beverage.stock + stockToAdd}}</strong>.
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancel</button>
        <button type="button" class="btn btn-success" [disabled]="busy || stockToAdd === 0"
                (click)="addStock()">{{ busy ? 'Saving...' : 'Save' }}</button>
      </div>
    </ng-template>
  `,
  styles: []
})
export class AdminBeverageAddStockModalComponent {
  @Input() beverage!: Beverage;

  @Input() refresh!: () => void;

  @ViewChild('content', {static: true}) content: any;

  busy = false;
  stockToAdd = 0;

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
    this.modal = this.modalService.open(this.content);
  }

  addStock(): void {
    this.busy = true;
    this.beverageService.addStock(this.beverage, this.stockToAdd).subscribe(response => {
      if (response.status === 200) {
        this.modal?.close();
        this.busy = false;
        this.refresh();
      }
    });
  }

}
