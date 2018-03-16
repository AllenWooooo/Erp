import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CustomerService } from '../../customer.service';
import { TabsService } from '../../../../../../components/tabs/tabs.service';

@Component({
  selector: 'app-customer-disabled-list',
  templateUrl: './disabled.component.html',
  styleUrls: ['./disabled.component.less']
})

export class CustomerDisabledListComponent implements OnInit, OnDestroy {
  private customers = <any>[];
  private pagination = {};
  private allSelected = false;
  private selectedId: number;
  private subscription: Subscription;

  @Output() selectItems: EventEmitter<any> = new EventEmitter();

  constructor(
    private customerService: CustomerService,
    private tabsService: TabsService
  ) {
    this.subscription = this.customerService
      .get()
      .subscribe(({ customers, currentPagination }) => {
        this.customers = customers;
        this.pagination = currentPagination;
      });
  }

  ngOnInit() {
    this.customerService.list();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectAll(evt) {
    this.allSelected = evt.target.checked;
    this.customers = this.customers.map(item => ({
      ...item,
      selected: this.allSelected
    }));
    this.selectItems.emit(this.allSelected ? this.customers : []);

  }

  select(evt, selectedItem) {
    this.customers = this.customers.map(item => ({
      ...item,
      selected: item.Id === selectedItem.Id ? evt.target.checked : item.selected
    }));
    this.allSelected = this.customers.every(item => item.selected);
    this.selectItems.emit(this.customers.filter(item => item.selected));
  }

  onPageChange({ current, pageSize }) {
    this.customerService.onPageChange({
      PageIndex: current,
      PageSize: pageSize
    });
  }
}
