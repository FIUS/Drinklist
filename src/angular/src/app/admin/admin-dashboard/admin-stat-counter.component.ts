import {Component, Input, OnChanges} from '@angular/core';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-admin-stat-counter',
  template: `
    <app-admin-stat [icon]="icon" [title]="title" [text]="text" [center]="true"></app-admin-stat>
  `,
  styles: []
})
export class AdminStatCounterComponent implements OnChanges {
  @Input() count = NaN;
  @Input() counted = 'THINGS';
  @Input() title = `Total ${this.counted}`;
  @Input() icon: IconDefinition | undefined;

  text = `There are currently ${this.count} ${this.counted}.`;

  constructor() {
  }

  ngOnChanges(): void {
    this.text = `There are currently ${this.count} ${this.counted}.`;
  }

}
