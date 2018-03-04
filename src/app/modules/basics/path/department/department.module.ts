import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UIModule } from '@UI/ui.module';

import { DepartmentService } from './department.service';
import { DepartmentSelectorComponent } from './components/department-selector/department-selector.component';

@NgModule({
  declarations: [
    DepartmentSelectorComponent
  ],
  imports: [
    UIModule,
    CommonModule
  ],
  exports: [DepartmentSelectorComponent],
  providers: [DepartmentService]
})

export class DepartmentModule {}
