import {Component, Input} from '@angular/core';
import {Beverage} from '../../models/beverage';
import {Util} from '../../util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-admin-beverages-table-entry]',
  template: `
    <th scope="row" class="text-end pe-3">{{beverage.id}}</th>
    <td>{{beverage.name}}</td>
    <td class="text-end pe-3">{{beverage.stock}}</td>
    <td class="text-end pe-3">{{moneyFormat(beverage.price)}}</td>
    <td>
      <app-admin-beverages-actions [beverage]="beverage" [refresh]="refresh"></app-admin-beverages-actions>
    </td>
  `,
  styles: []
})
export class AdminBeveragesTableEntryComponent {
  @Input() beverage!: Beverage;

  @Input() refresh!: () => void;

  // Aliases for template access
  moneyFormat = Util.moneyFormat;

  constructor() {
  }
}
