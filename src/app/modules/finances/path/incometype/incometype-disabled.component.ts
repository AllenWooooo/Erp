import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncomeTypeService } from './incometype.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';
import { LocalStorage } from 'ngx-webstorage';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-incometype-disabled',
  template: `
  <div class="actions">
    <app-quick-search [placeholder]="'输入编号、名称、手机号、联系人查询'" (onSearch)="onSearchDisabled($event)"></app-quick-search>
    <app-ui-button [style]="'danger'" [disabled]="!selectedItems.length" (click)="restore()">
        <i class="iconfont icon-delete"></i>
        还原
    </app-ui-button>
    <app-ui-button *ngIf="!systemConfig.IsOpenBill" [style]="'danger'" [disabled]="!selectedItems.length" (click)="delete()">
        <i class="iconfont icon-delete"></i>
        删除
    </app-ui-button>
    <div class="more">
    </div>
  </div>
  <div class="content">
    <app-incometype-disabled-list (selectItems)="selectItems($event)"></app-incometype-disabled-list>
  </div>
  `,
  styles: [`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      display: flex;
    }
  `],
  providers: [
    AppService
  ]
})

export class IncomeTypeDisabledComponent implements OnInit, OnDestroy {
  private selectedItems = <any>[];
  private subscription: Subscription;

  @LocalStorage()
  systemConfig: any;

  constructor(
    private incomeTypeService: IncomeTypeService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.systemConfig = this.getSystemConfig();
  }

  onSearch(queryKey) {
    this.incomeTypeService.onSearchDisabled(queryKey);
  }

  ngOnDestroy() {
  }

  getSystemConfig(): any {
    if (!this.systemConfig) {
      this.appService.getSystemConfig().subscribe((data) => {
        this.systemConfig = data;
      });
    }
    return this.systemConfig;
  }

  selectItems(selected) {
    this.selectedItems = selected;
  }

  delete() {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.incomeTypeService
          .remove(this.selectedItems.map(item => item.Id))
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.incomeTypeService.listDisabled();
            } else {
              this.alertService.open({
                type: 'danger',
                content: '删除失败, ' + data.ErrorMessages
              });
            }
          });
      }
    });
  }

  restore() {
    this.confirmService.open({
      content: '确认还原吗？',
      onConfirm: () => {
        this.incomeTypeService
          .restore(this.selectedItems.map(item => item.Id))
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '还原成功！'
              });
              this.incomeTypeService.listDisabled();
            } else {
              this.alertService.open({
                type: 'danger',
                content: '还原失败, ' + data.ErrorMessages
              });
            }
          });
      }
    });
  }
}
