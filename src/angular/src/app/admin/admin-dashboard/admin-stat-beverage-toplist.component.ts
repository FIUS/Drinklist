import {Component, OnInit} from '@angular/core';
import {BeverageService} from '../../services/beverage.service';
import {Beverage} from '../../models/beverage';

@Component({
  selector: 'app-admin-stat-beverage-toplist',
  template: `
    <app-admin-stat [text]="text" title="Top Beverages" [list]="beverages" [ordered]="true"
                    listEmptyText="No beverages have been ordered yet."></app-admin-stat>
  `,
  styles: []
})
export class AdminStatBeverageToplistComponent implements OnInit {
  text = 'These are the 5 most popular beverages:';

  beverages: string[] | undefined;

  constructor(
    private beverageService: BeverageService,
  ) {
  }

  ngOnInit(): void {
    this.beverageService.getTopBeverages().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.beverages = this.prepareToplist(response.data);
      }
    });
  }

  prepareToplist(list: Beverage[]): string[] {
    return list.map(beverage => {
      return `${beverage.name} (${beverage.stock < 5 ? '<strong class="text-danger">' : ''}${beverage.stock} left${beverage.stock < 5 ? '</strong>' : ''})`;
    });
  }

}
