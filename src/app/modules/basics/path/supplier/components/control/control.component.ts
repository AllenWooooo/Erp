import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SupplierService } from '../../supplier.service';
import { FormService } from '@services/form.service';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { AlertService } from '@services/alert.service';

const contractor = {
  Address: null,
  CreateUserName: null,
  CustomerId: 0,
  Email: null,
  ErrorMessages: null,
  Fax: null,
  Id: 0,
  IsOpenBill: false,
  IsValid: true,
  Mobile: null,
  Name: null,
  OpenBillTime: null,
  Remark: null,
  SortIndex: 0,
  Tel: null,
  UserName: null,
};

@Component({
  selector: 'app-supplier-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.less'],
  providers: [FormService]
})

export class SupplierControlComponent {
  private contactList = [{}, {}, {}];
  private form = new FormGroup({});
  private _show = false;

  
  get show() {
    return this._show;
  }

  @Input()
  set show(isShow) {
    this._show = isShow;
  }
  @Input() type = 'create';

  private _customerId: number;

  get customerId() {
    return this._customerId;
  }

  @Input()
  set customerId(customerId) {
    this._customerId = customerId;
    this.refreshList();
  }

  getTitle(): string {
    if (this.type === 'create') {
      return '添加供应商';
    } else {
      return '修改供应商';
    }
  }

  refreshList() {
    if (this._show) {
      if (this.type === 'create') {
        this.supplierService
          .newOne()
          .subscribe(data => {
            this.form = this.formService.createForm(data);
          });
      } else {
        this.supplierService
          .detail(this.customerId)
          .subscribe(data => {
            this.form = this.formService.createForm(data);
          });
      }
    }
  }

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  constructor(
    private supplierService: SupplierService,
    private formService: FormService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  get contractorList(): FormArray { return this.form.get('CustomerContractorList') as FormArray; }
  get categoryName() { return this.form.get('CustomerCategoryName').value; }
  get formReady(): boolean { return !!Object.keys(this.form.controls).length; }

  handleClose() {
    this.onClose.emit();
  }

  onSubmit({ value }) {
    if (this.type === 'create') {
      this.supplierService.create(value).subscribe(data => {
        if (data.IsValid) {
          this.onClose.emit();
          this.alertService.open({
            type: 'success',
            content: '添加成功！'
          });
          this.supplierService.list();
        }
      });
    } else {
      this.supplierService.update(value).subscribe(data => {
        if (data.IsValid) {
          this.onClose.emit();
          this.alertService.open({
            type: 'success',
            content: '修改成功！'
          });
          this.supplierService.list();
        }
      });
    }
  }

  addContractor(idx) {
    const control = <FormArray>this.form.controls['CustomerContractorList'];

    control.insert(idx + 1, this.fb.group(contractor));
  }

  removeContractor(idx) {
    const control = <FormArray>this.form.controls['CustomerContractorList'];

    control.removeAt(idx);
  }
}


