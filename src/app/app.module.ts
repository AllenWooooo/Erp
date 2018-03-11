import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UIModule } from '../UI/ui.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { TabOutletDirective } from './directives/outlet.directive';
import { TabsService } from './components/tabs/tabs.service';
import { HttpService } from './services/http.service';
import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';
import { ErrorService } from './services/error.service';
import { ConfirmService } from './services/confirm.service';

import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import { HomeComponent } from './modules/home/home.component';


export const ROUTES: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'basics/supplier',
    loadChildren: './modules/basics/path/supplier/supplier.module#SupplierModule'
  },
  {
    path: 'basics/otherexchangeunit',
    loadChildren: './modules/basics/path/otherexchangeunit/other-exchange-unit.module#OtherExchangeUnitModule'
  },
  {
    path: 'basics/customer',
    loadChildren: './modules/basics/path/customer/customer.module#CustomerModule'
  },
  {
    path: 'basics/employee',
    loadChildren: './modules/basics/path/employee/employee.module#EmployeeModule'
  },
  {
    path: 'basics/department',
    loadChildren: './modules/basics/path/department/department.module#DepartmentModule'
  },
  {
    path: 'purchase/order/new',
    loadChildren: './modules/purchase/path/order/path/new/new.module#PurchaseOrderNewModule'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    ContentComponent,
    TabsComponent,
    TabOutletDirective,
    HomeComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    UIModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
  //   {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: LoadingInterceptor,
  //   multi: true
  // },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }, LoadingService, HttpService, TabsService, AlertService, ConfirmService, ErrorService],
  bootstrap: [AppComponent]
})

export class AppModule {



}
