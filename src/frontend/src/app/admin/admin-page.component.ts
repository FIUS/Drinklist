import {Component, OnInit, Type} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {faBox, faHome} from '@fortawesome/free-solid-svg-icons';
import {AdminPageModule} from './admin-page-module';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  public activeModule: string | undefined;
  public activeModuleComponent: Type<any> | undefined;

  public modules: AdminPageModule[] = [
    {
      id: 'dashboard',
      displayName: 'Dashboard',
      icon: faHome,
      spacerAfter: true,
      component: AdminDashboardComponent,
    },
    {
      id: 'other',
      displayName: 'Other',
      icon: faBox,
      spacerAfter: false,
    },
  ];

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.activeModule = params.module;
      this.activeModuleComponent = this.modules.find(module => {
        return module.id === this.activeModule;
      })?.component;
    });
  }

}
