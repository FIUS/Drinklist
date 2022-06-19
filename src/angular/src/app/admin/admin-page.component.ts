import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ChildActivationEnd, Event, Router} from '@angular/router';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {BackupService} from '../services/backup.service';
import {saveAs} from 'file-saver';
import {filter} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {subpages} from './admin-subpages';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  activeModule: string | undefined;

  subpages = subpages;

  // FontAwesome icons
  icons = {
    download: faDownload,
  };

  childNavEvent$: Observable<ChildActivationEnd>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private backupService: BackupService,
  ) {
    this.childNavEvent$ = router.events
      .pipe(
        filter<Event, ChildActivationEnd>((event: Event): event is ChildActivationEnd => event instanceof ChildActivationEnd),
        filter(event => event.snapshot.component === route.component)
      );
  }

  ngOnInit(): void {
    this.activeModule = this.route.snapshot.firstChild?.url[0].path;
    this.childNavEvent$.subscribe({
      next: event => {
        this.activeModule = event.snapshot.firstChild?.url[0].path;
      }
    });
  }

  downloadDB(): void {
    this.backupService.getDatabaseBackup().subscribe(response => {
      if (response.status === 200 && response.data) {
        saveAs(response.data, `dump-${Date.now()}.sql`);
      }
    });
  }
}
