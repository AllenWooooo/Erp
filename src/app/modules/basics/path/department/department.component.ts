import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-basics-department',
  template: `
    <div>department
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

export class DepartmentComponent implements OnInit, OnDestroy {
  constructor(
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
