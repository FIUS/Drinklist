import {Component, Input} from '@angular/core';
import {Beverage} from '../../models/beverage';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-beverages-table',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" style="width: 40%">Name</th>
          <th scope="col" style="width: 10%">&#8470; in Stock</th>
          <th scope="col" style="width: 15%">Price</th>
          <th scope="col"></th>
        </tr>
        <tr>
          <th>{{beverages.length}}</th>
          <th><input class="form-control" placeholder="Search..."></th>
          <th><input class="form-control text-right" placeholder="Search..."></th>
          <th><input class="form-control text-right" placeholder="Search..."></th>
          <th>
            <button type="button" class="btn btn-warning w-100" (click)="newBeverage.open()">
              <fa-icon [icon]="icons.plus"></fa-icon>
              Add
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let beverage of beverages; index as i" app-admin-beverages-table-entry [beverage]="beverage" [number]="i + 1"
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

  public icons = {
    plus: faPlus,
  };

  constructor() {
  }

}
