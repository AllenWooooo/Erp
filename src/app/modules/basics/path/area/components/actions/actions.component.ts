import { Component, Input } from '@angular/core';
import { AreaService } from '../../area.service';
import { ConfirmService } from '@services/confirm.service';
import { AlertService } from '@services/alert.service';

@Component({
  selector: 'app-area-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.less']
})

export class AreaActionsComponent {
  private _show = false;
  private selectedId: number;

  @Input() selectedItems = <any>[];

  constructor(
    private areaService: AreaService,
    private confirmService: ConfirmService,
    private alertService: AlertService
  ) {}

  show() {
    this._show = true;
    this.selectedId = 0;
  }

  close() {
    this._show = false;
  }

  onSearch(queryKey) {
    this.areaService.onSearch(queryKey);
  }

  onCancel() {
    this.confirmService.open({
      content: '确认删除吗？',
      onConfirm: () => {
        this.areaService
          .cancel(this.selectedItems.map(item => item.Id))
          .subscribe(data => {
            if (data.IsValid) {
              this.alertService.open({
                type: 'success',
                content: '删除成功！'
              });
              this.areaService.list();
            }
          });
      }
    });
  }
}
