import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {Type} from '@angular/core';

export interface AdminPageModule {
  id: string;
  displayName: string;
  icon: IconDefinition;
  spacerAfter: boolean;
  component?: Type<any>;
}
