import {Component, Input, OnInit} from '@angular/core';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-admin-stat',
  template: `
    <div class="card h-100">
      <h4 class="card-header">{{title}}</h4>
      <div class="card-body" [class.text-center]="center">
        <fa-icon style="font-size: 5rem" *ngIf="icon" [icon]="icon"></fa-icon>
        <div class="card-text">
          {{text}}
          <ng-container *ngIf="list">
            <ol *ngIf="ordered; else unordered">
              <li *ngFor="let item of list" [innerHTML]="item"></li>
            </ol>
            <ng-template #unordered>
              <ul>
                <li *ngFor="let item of list" [innerHTML]="item">{{item}}</li>
              </ul>
            </ng-template>
            <ng-container *ngIf="list.length === 0">
              {{listEmptyText}}
            </ng-container>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminStatComponent implements OnInit {
  @Input() title = 'TITLE MISSING';
  @Input() icon: IconDefinition | undefined;

  @Input() text = 'TEXT MISSING';
  @Input() center = false;

  @Input() list: string[] | undefined;
  @Input() listEmptyText = 'The list is empty.';
  @Input() ordered = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
