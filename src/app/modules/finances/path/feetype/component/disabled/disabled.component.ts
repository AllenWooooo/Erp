import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FeeTypeService } from '../../feetype.service';
import { LocalStorage } from 'ngx-webstorage';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-feetype-disabled-list',
  templateUrl: './disabled.component.html',
  styleUrls: ['./disabled.component.less'],
  providers: [
    AppService
  ]
})

export class FeeTypeDisabledListComponent implements OnInit, OnDestroy {
  private feeTypes = <any>[];
  private pagination = {};
  private allSelected = false;
  private selectedId: number;
  private subscription: Subscription;

  @LocalStorage()
  systemConfig: any;

  @Output() selectItems: EventEmitter<any> = new EventEmitter();

  constructor(
    private feeTypeService: FeeTypeService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private appService: AppService
  ) {
    this.subscription = this.feeTypeService
      .get()
      .subscribe(({ feeTypes, currentPagination }) => {
        this.feeTypes = feeTypes;
        this.pagination = currentPagination;
      });
  }

  getSystemConfig(): any {
    if (!this.systemConfig) {
      this.appService.getSystemConfig().subscribe((data) => {
        this.systemConfig = data;
      });
    }
    return this.systemConfig;
  }

  ngOnInit() {
    this.getSystemConfig();
    this.feeTypeService.listDisabled();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectAll(evt) {
    this.allSelected = evt.target.checked;
    this.feeTypes = this.feeTypes.map(item => ({
      ...item,
      selected: this.allSelected
    }));
    this.selectItems.emit(this.allSelected ? this.feeTypes : []);

  }

  select(evt, selectedItem) {
    this.feeTypes = this.feeTypes.map(item => ({
      ...item,
      selected: item.Id === selectedItem.Id ? evt.target.checked : item.selected
    }));
    this.allSelected = this.feeTypes.every(item => item.selected);
    this.selectItems.emit(this.feeTypes.filter(item => item.selected));
  }

  onPageChange({ current, pageSize }) {
    this.feeTypeService.onPageChangeDisabled({
      PageIndex: current,
      PageSize: pageSize
    });
  }

  delete(id) {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.feeTypeService
          .remove([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.feeTypeService.listDisabled();
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

  restore(id) {
    this.confirmService.open({
      content: '确认还原吗？',
      onConfirm: () => {
        this.feeTypeService
          .restore([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '还原成功！'
              });
              this.feeTypeService.listDisabled();
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
