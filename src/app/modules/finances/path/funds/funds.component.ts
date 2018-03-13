import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FundsService } from './funds.service';

@Component({
  selector: 'app-finances-funds',
  template: `
    <app-funds-actions [selectedItems]="selectedItems"></app-funds-actions>
    <div class="content">
      <app-funds-list (selectItems)="selectItems($event)"></app-funds-list>
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

export class FundsComponent implements OnInit, OnDestroy {
  private selectedItems = <any>[];
  private category;
  private subscription: Subscription;

  constructor(
    private fundsService: FundsService
  ) {}

  ngOnInit() {
    this.subscription = this.fundsService
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
