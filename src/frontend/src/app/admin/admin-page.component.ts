import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {faBox, faHome} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-page',
  template: `
    <div class="row mx-0">
      <div class="col-md-2 px-0 bg-light text-dark admin-module-selector border-right">
        <h1 class="h4 pl-3 my-2">Admin Area</h1>
        <ul class="list-unstyled">
          <li *ngFor="let module of modules" class="admin-module" [class.admin-module-active]="activeModule===module.id"
              [routerLink]="'../' + module.id">
            <fa-icon [icon]="module.icon"></fa-icon>
            {{module.displayName}}
          </li>
        </ul>
      </div>
      <div class="col">
        <app-admin-dashboard *ngIf="activeModule==='dashboard'"></app-admin-dashboard>
      </div>
    </div>
  `,
  styles: [`
    .admin-module-selector {
      min-height: 94vh;
      border-color: #eee;
    }

    .admin-module {
      padding: 8px 16px;
      cursor: pointer;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    }

    .admin-module:hover {
      color: black;
      background-color: rgba(0, 0, 0, .05);
    }

    .admin-module-active {
      background-color: #ffc107; /* bootstrap warning color */
      color: black;
      cursor: default;
    }

    .admin-module-active:hover {
      background-color: #ffc107; /* bootstrap warning color */
    }

    /* remove fill on smaller screens where cols wrap
       equal to bootstrap md breakpoint */
    @media (max-width: 768px) {
      .admin-module-selector {
        min-height: unset;
      }
    }
  `]
})
export class AdminPageComponent implements OnInit {

  public activeModule: string | undefined;

  public modules = [
    {
      id: 'dashboard',
      displayName: 'Dashboard',
      icon: faHome
    },
    {
      id: 'other',
      displayName: 'Other',
      icon: faBox,
    },
  ];

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.activeModule = params.module;
    });
  }

}
