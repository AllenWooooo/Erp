import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IncomeTypeService } from './incometype.service';

@Component({
  selector: 'app-finances-incometype',
  template: `
    <app-incometype-actions [selectedItems]="selectedItems"></app-incometype-actions>
    <div class="content">
      <app-incometype-list (selectItems)="selectItems($event)"></app-incometype-list>
    </div>
  `,
  styles: [`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      display: flex;
    }
  `]
})

export class IncomeTypeComponent implements OnInit, OnDestroy {
  private selectedItems = <any>[];
  private category;
  private subscription: Subscription;

  constructor(
    private incomeTypeService: IncomeTypeService
  ) {}

  ngOnInit() {
    this.subscription = this.incomeTypeService
      .get()
      .subscribe(({ currentCategory }) => {
        this.category = currentCategory;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectItems(selected) {
    this.selectedItems = selected;
  }
}
