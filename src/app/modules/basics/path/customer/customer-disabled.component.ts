import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from './customer.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';

@Component({
  selector: 'app-customer-disabled',
  template: `
  <div class="actions">
    <app-quick-search [placeholder]="'输入编号、名称、手机号、联系人查询'" (onSearch)="onSearch($event)"></app-quick-search>
    <app-ui-button [style]="'danger'" [disabled]="!selectItems.length" (click)="restore()">
        <i class="iconfont icon-delete"></i>
        还原
    </app-ui-button>
    <div class="more">
    </div>
  </div>
  <div class="content">
    <app-category
        (onChange)="onCategoryChange($event)"
        [resourceType]="'Customer'"
    ></app-category>
    <app-customer-disabled-list (selectItems)="selectItems($event)"></app-customer-disabled-list>
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
  `]
})

export class CustomerDisabledComponent implements OnInit, OnDestroy {
  private selectedItems = <any>[];
  private category;
  private subscription: Subscription;

  constructor(
    private customerService: CustomerService,
    private confirmService: ConfirmService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.subscription = this.customerService
      .get()
      .subscribe(({ currentCategory }) => {
        this.category = currentCategory;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectItems(selected) {
    this.selectedItems = selected;
  }

  onCategoryChange(selected) {
    this.customerService.onCategoryChange(selected);
  }

  restore(id) {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.customerService
          .cancel([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.customerService.list();
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
}
