import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {faBox, faHome} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
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
      spacer: true,
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
