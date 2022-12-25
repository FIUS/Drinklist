import {Component, Input} from '@angular/core';
import {Beverage} from '../../models/beverage';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {Util} from '../../util';

@Component({
  selector: 'app-admin-beverages-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">&#8470; in Stock</th>
          <th scope="col">Price</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th><input class="form-control text-end" placeholder="Search..." [(ngModel)]="search.id"></th>
          <th><input class="form-control" placeholder="Search..." [(ngModel)]="search.name"></th>
          <th><input class="form-control text-end" placeholder="Search..." [(ngModel)]="search.stock"></th>
          <th><input class="form-control text-end" placeholder="Search..." [(ngModel)]="search.price"></th>
          <th>
            <button type="button" class="btn btn-warning w-100" (click)="newBeverage.open()">
              <fa-icon [icon]="icons.plus"></fa-icon>
              Add
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let beverage of beverages.filter(matchesSearch, this)" app-admin-beverages-table-entry [beverage]="beverage"
            [refresh]="refresh"></tr>
      </tbody>
    </table>
    <app-admin-new-beverage-modal [refresh]="refresh" #newBeverage></app-admin-new-beverage-modal>
  `,
  styles: []
})
export class AdminBeveragesTableComponent {
  @Input() beverages: Beverage[] = [];
  @Input() refresh!: () => void;

  search = {
    id: '',
    name: '',
    stock: '',
    price: '',
  };

  // FontAwesome icons
  icons = {
    plus: faPlus,
  };

  constructor() {
  }

  matchesSearch(beverage: Beverage): boolean {
    if (!beverage) {
      return false;
    }

    const matchesId = beverage.id.toString().includes(this.search.id.toLowerCase());
    const matchesName = beverage.name.toLowerCase().includes(this.search.name.toLowerCase());
    const matchesStock = beverage.stock.toString().toLowerCase().includes(this.search.stock.toLowerCase());
    const matchesPrice = Util.moneyFormat(beverage.price).toLowerCase().includes(this.search.price.toLowerCase());

    return matchesId && matchesName && matchesStock && matchesPrice;
  }

}
