import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminConfirmationModalComponent} from './admin-confirmation-modal.component';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {AdminNewBeverageModalComponent} from './admin-beverage-modals/admin-new-beverage-modal.component';
import {FormsModule} from '@angular/forms';
import {AdminBeverageAddStockModalComponent} from './admin-beverage-modals/admin-beverage-add-stock-modal.component';
import {AdminBeverageEditPriceModalComponent} from './admin-beverage-modals/admin-beverage-edit-price-modal.component';
import {AdminUserAddComponent} from './admin-user-modals/admin-user-add.component';
import {AdminUserAddMoneyComponent} from './admin-user-modals/admin-user-add-money.component';


@NgModule({
  declarations: [
    AdminConfirmationModalComponent,
    AdminNewBeverageModalComponent,
    AdminBeverageAddStockModalComponent,
    AdminBeverageEditPriceModalComponent,
    AdminUserAddComponent,
    AdminUserAddMoneyComponent,
  ],
  exports: [
    AdminConfirmationModalComponent,
    AdminNewBeverageModalComponent,
    AdminBeverageAddStockModalComponent,
    AdminBeverageEditPriceModalComponent,
    AdminUserAddComponent,
    AdminUserAddMoneyComponent,
  ],
  imports: [
    CommonModule,
    NgbButtonsModule,
    FormsModule,
  ]
})
export class AdminModalsModule {
}
