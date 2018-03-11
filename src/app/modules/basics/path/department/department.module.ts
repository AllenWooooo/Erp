import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UIModule } from '@UI/ui.module';

import { DepartmentService } from './department.service';
import { DepartmentSelectorComponent } from './components/department-selector/department-selector.component';
import { DepartmentComponent } from './department.component';

export const ROUTES: Routes = [
  {
    path: '', component: DepartmentComponent, outlet: 'basics-department'
  }
];


@NgModule({
  declarations: [
    DepartmentSelectorComponent,
    DepartmentComponent
  ],
  imports: [
    UIModule,
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [DepartmentSelectorComponent],
  providers: [DepartmentService]
})

export class DepartmentModule {}
