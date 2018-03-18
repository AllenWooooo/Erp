import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { StorageService } from '../../storage.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';

@Component({
    selector: 'app-storage-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less']
  })

export class StorageListComponent implements OnInit, OnDestroy {
  private storages = <any>[];
  private pagination = {};
  private allSelected = false;
  private selectedId: number;
  private _showUpdate = false;
  private subscription: Subscription;

  @Output() selectItems: EventEmitter<any> = new EventEmitter();

  constructor(
    private storageService: StorageService,
    private confirmService: ConfirmService,
    private alertService: AlertService
  ) {
    this.subscription = this.storageService
      .get()
      .subscribe(({ storages, currentPagination }) => {
        this.storages = storages;
        this.pagination = currentPagination;
      });
  }

  ngOnInit() {
    this.storageService.list();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  selectAll(evt) {
    this.allSelected = evt.target.checked;
    this.storages = this.storages.map(item => ({
      ...item,
      selected: this.allSelected
    }));
    this.selectItems.emit(this.allSelected ? this.storages : []);

  }

  select(evt, selectedItem) {
    this.storages = this.storages.map(item => ({
      ...item,
      selected: item.Id === selectedItem.Id ? evt.target.checked : item.selected
    }));
    this.allSelected = this.storages.every(item => item.selected);
    this.selectItems.emit(this.storages.filter(item => item.selected));
  }

  onPageChange({ current, pageSize }) {
    this.storageService.onPageChange({
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
        this.storageService
          .cancel([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.storageService.list();
            }
          });
      }
    });
  }
}
