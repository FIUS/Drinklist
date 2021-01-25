import {Component, Input} from '@angular/core';
import {Beverage} from '../../models/beverage';
import {faCog, faPlus, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {BeverageService} from '../../services/beverage.service';

@Component({
  selector: 'app-admin-beverages-actions',
  template: `
    <div class="row">
      <div class="col">
        <button class="btn btn-sm btn-warning w-100" (click)="addStock.open()">
          <fa-icon [icon]="icons.plus"></fa-icon>
          Add Stock
        </button>
      </div>
      <div class="col pl-0">
        <button class="btn btn-sm btn-warning w-100" (click)="editPrice.open()">
          <fa-icon [icon]="icons.cog"></fa-icon>
          Edit Price
        </button>
      </div>
      <div class="col pl-0">
        <button class="btn btn-sm btn-warning w-100" (click)="deleteConfirmation.open()">
          <fa-icon [icon]="icons.minus"></fa-icon>
          Remove
        </button>
      </div>
    </div>
    <app-admin-beverage-add-stock-modal #addStock [beverage]="beverage" [refresh]="refresh"></app-admin-beverage-add-stock-modal>
    <app-admin-beverage-edit-price-modal #editPrice [beverage]="beverage" [refresh]="refresh"></app-admin-beverage-edit-price-modal>
    <app-admin-confirmation-modal #deleteConfirmation [callback]="deleteBeverage" [yes]="'Delete ' + beverage.name">
      Do you really want to <strong>permanently delete</strong> {{beverage.name}}?<br/>
      <span class="text-danger">This action cannot be undone!</span> Historic transactions will remain untouched.
    </app-admin-confirmation-modal>
  `,
  styles: []
})
export class AdminBeveragesActionsComponent {
  @Input() beverage!: Beverage;

  @Input() refresh!: () => void;

  icons = {
    cog: faCog,
    minus: faTrashAlt,
    plus: faPlus,
  };

  constructor(
    private beverageService: BeverageService,
  ) {
  }

  deleteBeverage = () => {
    this.beverageService.deleteBeverage(this.beverage).subscribe(response => {
      if (response.status === 200) {
        this.refresh();
      }
    });
  }

}
