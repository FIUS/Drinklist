import {Component, OnInit} from '@angular/core';
import {faBeer} from '@fortawesome/free-solid-svg-icons';
import {Beverage} from '../../models/beverage';
import {BeverageService} from '../../services/beverage.service';

@Component({
  selector: 'app-admin-beverages',
  template: `
    <div class="container-fluid">
      <h1>
        <fa-icon [icon]="icons.beer"></fa-icon>
        Beverages
      </h1>
      <app-admin-beverages-table [beverages]="beverages" [refresh]="refresh"></app-admin-beverages-table>
    </div>
  `,
  styles: []
})
export class AdminBeveragesComponent implements OnInit {

  beverages: Beverage[] = [];

  // FontAwesome icons
  icons = {
    beer: faBeer,
  };

  constructor(
    private beverageService: BeverageService,
  ) {
  }

  ngOnInit(): void {
    this.loadBeverages();
  }

  refresh = () => {
    this.loadBeverages();
  }

  loadBeverages(): void {
    this.beverageService.getBeveragesAdmin().subscribe(response => {
      if (response.status === 200 && response.data) {
        this.beverages = response.data;
      }
    });
  }

}
