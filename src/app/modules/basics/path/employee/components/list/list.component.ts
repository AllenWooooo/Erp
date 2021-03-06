import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EmployeeService } from '../../employee.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';
import { AppService } from '@services/app.service';
import { LocalStorage } from 'ngx-webstorage';


@Component({
    selector: 'app-employee-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less'],
    providers:[
      AppService
    ]
  })

export class EmployeeListComponent implements OnInit, OnDestroy {
  private employees = <any>[];
  private pagination = {};
  private allSelected = false;
  private selectedId: number;
  private _showUpdate = false;
  private subscription: Subscription;

  @LocalStorage()
  systemConfig:any;

  @Output() selectItems: EventEmitter<any> = new EventEmitter();

  constructor(
    private employeeService: EmployeeService,
    private confirmService: ConfirmService,
    private alertService: AlertService,
    private appService:AppService
  ) {
    this.subscription = this.employeeService
      .get()
      .subscribe(({ employees, currentPagination }) => {
        this.employees = employees;
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
    this.employeeService.list();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  selectAll(evt) {
    this.allSelected = evt.target.checked;
    this.employees = this.employees.map(item => ({
      ...item,
      selected: this.allSelected
    }));
    this.selectItems.emit(this.allSelected ? this.employees : []);

  }

  select(evt, selectedItem) {
    this.employees = this.employees.map(item => ({
      ...item,
      selected: item.Id === selectedItem.Id ? evt.target.checked : item.selected
    }));
    this.allSelected = this.employees.every(item => item.selected);
    this.selectItems.emit(this.employees.filter(item => item.selected));
  }

  onPageChange({ current, pageSize }) {
    this.employeeService.onPageChange({
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
      content: '确认停用吗？',
      onConfirm: () => {
        this.employeeService
          .cancel([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '停用成功！'
              });
              this.employeeService.list();
            }
          });
      }
    });
  }

  onRemove(id) {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.employeeService
          .cancel([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.employeeService.list();
            }
          });
      }
    });
  }
}
