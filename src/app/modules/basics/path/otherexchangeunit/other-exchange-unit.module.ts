import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '@UI/ui.module';
import { OtherExchangeUnitComponent } from './other-exchange-unit.component';
import { OtherExchangeUnitListComponent } from './components/list/list.component';
import { OtherExchangeUnitActionsComponent } from './components/actions/actions.component';
import { OtherExchangeUnitControlComponent } from './components/control/control.component';
import { QuickSearchComponent } from '@components/quick-search/quick-search.component';
import { CategoryComponent } from '@components/category/category.component';
import { CategoryNodeComponent } from '@components/category/category-node.component';
import { CardComponent } from '@components/card/card.component';
import { PaginationBarComponent } from '@components/pagination-bar/pagination-bar.component';
import { FormFieldComponent } from '@components/form-field/form-field.component';
import { OtherExchangeUnitService } from './other-exchange-unit.service';
import { FormService } from '@services/form.service';
import { StringAddonPipe } from '@pipes/string-addon.pipe';

import { EmployeeModule } from '../employee/employee.module';
import { AreaModule } from '../area/area.module';
import { AppCommonModule } from '@modules/common/common.module';

export const ROUTES: Routes = [
  {
    path: '', component: OtherExchangeUnitComponent, outlet: 'basics-otherexchangeunit'
  }
];

@NgModule({
  declarations: [
    OtherExchangeUnitComponent,
    OtherExchangeUnitListComponent,
    OtherExchangeUnitActionsComponent,
    OtherExchangeUnitControlComponent,
    QuickSearchComponent,
    CategoryComponent,
    CategoryNodeComponent,
    CardComponent,
    PaginationBarComponent,
    FormFieldComponent,
    StringAddonPipe
  ],
  imports: [
    UIModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeModule,
    AreaModule,
    AppCommonModule,
    RouterModule.forChild(ROUTES)
  ],
  providers: [OtherExchangeUnitService]
})

export class OtherExchangeUnitModule {}
