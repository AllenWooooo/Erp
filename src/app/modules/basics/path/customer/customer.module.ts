import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '@UI/ui.module';
import { CustomerComponent } from './customer.component';
import { CustomerListComponent } from './component/list/list.component';
import { CustomerActionsComponent } from './component/actions/actions.component';
import { CustomerControlComponent } from './component/control/control.component';
import { QuickSearchComponent } from '@components/quick-search/quick-search.component';
import { CategoryComponent } from '@components/category/category.component';
import { CategoryNodeComponent } from '@components/category/category-node.component';
import { CardComponent } from '@components/card/card.component';
import { PaginationBarComponent } from '@components/pagination-bar/pagination-bar.component';
import { FormFieldComponent } from '@components/form-field/form-field.component';
import { CustomerService } from './customer.service';
import { FormService } from '@services/form.service';
import { StringAddonPipe } from '@pipes/string-addon.pipe';

import { EmployeeModule } from '../employee/employee.module';
import { AreaModule } from '../area/area.module';
import { AppCommonModule } from '@modules/common/common.module';

export const ROUTES: Routes = [
  {
    path: '', component: CustomerComponent, outlet: 'basics-customer'
  }
];

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerActionsComponent,
    CustomerControlComponent,
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
  providers: [CustomerService]
})

export class CustomerModule {}
