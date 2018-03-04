import { Component, Input } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';

@Component({
  selector: 'app-employee-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.less']
})

export class EmployeeActionsComponent {
  private _show = false;

  @Input() selectedItems = <any>[];

  constructor(
    private employeeService: EmployeeService,
    private confirmService: ConfirmService,
    private alertService: AlertService
  ) {}

  show() {
    this._show = true;
  }

  close() {
    this._show = false;
  }

  onSearch(queryKey) {
    this.employeeService.onSearch(queryKey);
  }

  onCancel() {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.employeeService
          .cancel(this.selectedItems.map(item => item.Id))
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
