import {Component, OnInit} from '@angular/core';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {AppConfig} from '../../app.config';
import {IAppConfig} from '../../models/i-app-config';
import {AdminSettingsService} from '../admin-services/admin-settings.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styles: [],
  providers: [AdminSettingsService]
})
export class AdminSettingsComponent implements OnInit {

  settings!: IAppConfig;

  // FontAwesome icons
  icons = {
    cog: faCog,
  };

  constructor(
    private settingsService: AdminSettingsService,
    private appConfig: AppConfig,
    private title: Title,
  ) {
  }

  ngOnInit(): void {
    // Clone the object to prevent side effects
    this.settings = Object.assign({}, AppConfig.config);
  }

  save(): void {
    this.settingsService.save(this.settings).subscribe(response => {
      if (response.status === 200) {
        this.appConfig.load().then(() => {
          this.title.setTitle(AppConfig.config.title);
        });
      }
    });
  }
}
