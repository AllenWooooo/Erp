import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AreaService } from '../../area.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';
import { AppService } from '@services/app.service';

@Component({
    selector: 'app-area-disabled-list',
    templateUrl: './disabled.component.html',
    styleUrls: ['./disabled.component.less']
  })

export class AreaDisabledListComponent implements OnInit, OnDestroy {
  private areas = <any>[];
  private pagination = {};
  private allSelected = false;
  private selectedId: number;
  private _showUpdate = false;
  private subscription: Subscription;
  private systemConfig:boolean;

  @Output() selectItems: EventEmitter<any> = new EventEmitter();

  constructor(
    private areaService: AreaService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private appService:AppService
  ) {
    this.subscription = this.areaService
      .get()
      .subscribe(({ areas, currentPagination }) => {
        this.areas = areas;
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
    this.areaService.listDisabled();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  selectAll(evt) {
    this.allSelected = evt.target.checked;
    this.areas = this.areas.map(item => ({
      ...item,
      selected: this.allSelected
    }));
    this.selectItems.emit(this.allSelected ? this.areas : []);

  }

  select(evt, selectedItem) {
    this.areas = this.areas.map(item => ({
      ...item,
      selected: item.Id === selectedItem.Id ? evt.target.checked : item.selected
    }));
    this.allSelected = this.areas.every(item => item.selected);
    this.selectItems.emit(this.areas.filter(item => item.selected));
  }

  onPageChange({ current, pageSize }) {
    this.areaService.onPageChange({
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

  delete(id) {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.areaService
          .remove([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.areaService.listDisabled();
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
        this.areaService.restore([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '还原成功！'
              });
              this.areaService.listDisabled();
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
