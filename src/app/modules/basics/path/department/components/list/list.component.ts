import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DepartmentService } from '../../department.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less']
  })

export class DepartmentListComponent implements OnInit, OnDestroy {
  private departments = <any>[];
  private pagination = {};
  private allSelected = false;
  private selectedId: number;
  private selectCategory:any;
  private _showUpdate = false;
  private subscription: Subscription;

  @Output() selectItems: EventEmitter<any> = new EventEmitter();


  constructor(
    private departmentService: DepartmentService,
    private confirmService: ConfirmService,
    private alertService: AlertService
  ) {
    this.subscription = this.departmentService
      .get()
      .subscribe(({ departments, currentPagination }) => {
        this.departments = departments;
        this.pagination = currentPagination;
      });
  }

  ngOnInit() {
    this.departmentService.list();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  selectAll(evt) {
    this.allSelected = evt.target.checked;
    this.departments = this.departments.map(item => ({
      ...item,
      selected: this.allSelected
    }));
    this.selectItems.emit(this.allSelected ? this.departments : []);

  }

  select(evt, selectedItem) {
    this.departments = this.departments.map(item => ({
      ...item,
      selected: item.Id === selectedItem.Id ? evt.target.checked : item.selected
    }));
    this.allSelected = this.departments.every(item => item.selected);
    this.selectItems.emit(this.departments.filter(item => item.selected));
  }

  onPageChange({ current, pageSize }) {
    this.departmentService.onPageChange({
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
        this.departmentService
          .cancel([id])
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.departmentService.list();
            }
          });
      }
    });
  }
}
