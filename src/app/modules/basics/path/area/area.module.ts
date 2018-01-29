import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UIModule } from '@UI/ui.module';

import { AreaService } from './area.service';
import { AreaSelectorComponent } from './components/area-selector/area-selector.component';

@NgModule({
  declarations: [
    AreaSelectorComponent
  ],
  imports: [
    UIModule,
    CommonModule
  ],
  exports: [AreaSelectorComponent],
  providers: [AreaService]
})

export class AreaModule {}
