import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OtherExchangeUnitService } from '../../other-exchange-unit.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';
import { AppService } from '@services/app.service';
import { LocalStorage } from 'ngx-webstorage';

@Component({
  selector: 'app-otherexchangeunit-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})

export class OtherExchangeUnitListComponent implements OnInit, OnDestroy {
  private otherExchangeUnits = <any>[];
  private pagination = {};
  private _showContact = false;
  private contactList = <any>[];
  private allSelected = false;
  private selectedId: number;
  private _showUpdate = false;
  private subscription: Subscription;

  @LocalStorage()
  systemConfig: any;

  @Output() selectItems: EventEmitter<any> = new EventEmitter();

  constructor(
    private otherExchangeUnitService: OtherExchangeUnitService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private appService: AppService
  ) {
    this.subscription = this.otherExchangeUnitService
      .get()
      .subscribe(({ otherExchangeUnits, currentPagination }) => {
        this.otherExchangeUnits = otherExchangeUnits;
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
    this.otherExchangeUnitService.list();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showContact(otherExchangeUnitId) {
    this._showContact = true;
    this.otherExchangeUnitService.contactList(otherExchangeUnitId).subscribe(data => {
      this.contactList = data;
    });
  }

  closeContact() {
    this._showContact = false;
  }

  selectAll(evt) {
    this.allSelected = evt.target.checked;
    this.otherExchangeUnits = this.otherExchangeUnits.map(item => ({
      ...item,
      selected: this.allSelected
    }));
    this.selectItems.emit(this.allSelected ? this.otherExchangeUnits : []);

  }

  select(evt, selectedItem) {
    this.otherExchangeUnits = this.otherExchangeUnits.map(item => ({
      ...item,
      selected: item.Id === selectedItem.Id ? evt.target.checked : item.selected
    }));
    this.allSelected = this.otherExchangeUnits.every(item => item.selected);
    this.selectItems.emit(this.otherExchangeUnits.filter(item => item.selected));
  }

  onPageChange({ current, pageSize }) {
    this.otherExchangeUnitService.onPageChange({
      PageIndex: current,
      PageSize: pageSize
    });
  }

  update(id) {
    this.selectedId = id;
    this._showUpdate = true;
  }

  closeUpdate() {
    this._showUpdate = false;
  }

  onCancel(id) {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.otherExchangeUnitService
          .cancel([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.otherExchangeUnitService.list();
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
