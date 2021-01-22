import {Component, Input} from '@angular/core';
import {Beverage} from '../../models/beverage';
import {Util} from '../../util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-admin-beverages-table-entry]',
  template: `
    <th scope="row" class="text-right">{{number}}</th>
    <td>{{beverage?.name}}</td>
    <td class="text-right pr-3">{{beverage?.stock}}</td>
    <td class="text-right pr-3">{{moneyFormat(beverage!.price)}}</td>
    <td>
      <app-admin-beverages-actions [beverage]="beverage!" [refresh]="refresh"></app-admin-beverages-actions>
    </td>
  `,
  styles: []
})
export class AdminBeveragesTableEntryComponent {
  @Input() beverage: Beverage | undefined;
  @Input() number = -1;

  @Input() refresh!: () => void;

  // Aliases for template access
  moneyFormat = Util.moneyFormat;

  constructor() {
  }
}
