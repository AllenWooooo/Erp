import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UIModule } from '@UI/ui.module';

import { CommonService } from './common.service';
import { SalePriceLevelSelectorComponent } from './components/sale-price-level-selector/sale-price-level-selector.component';


import { CardComponent } from '@components/card/card.component';
import { FormService } from '@services/form.service';
import { StringAddonPipe } from '@pipes/string-addon.pipe';
import { PaginationBarComponent } from '@components/pagination-bar/pagination-bar.component';
import { FormFieldComponent } from '@components/form-field/form-field.component';
import { QuickSearchComponent } from '@components/quick-search/quick-search.component';

@NgModule({
  declarations: [
    SalePriceLevelSelectorComponent,    
    PaginationBarComponent,
    FormFieldComponent,
    StringAddonPipe,
    QuickSearchComponent,
    CardComponent
  ],
  imports: [
    UIModule,
    CommonModule
  ],
  exports: [
    SalePriceLevelSelectorComponent,    
    PaginationBarComponent,
    FormFieldComponent,
    StringAddonPipe,
    CardComponent,
    QuickSearchComponent
  ],
  providers: [CommonService]
})

export class AppCommonModule {}
