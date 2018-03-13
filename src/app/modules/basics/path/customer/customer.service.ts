import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class CustomerService {
  private customers$ = new Subject<any>();
  private state = {
    customers: [],
    currentQueryKey: '',
    currentCategory: { Id: null },
    currentPagination: {
      PageIndex: 1,
      PageSize: 25,
      TotalCount: 0
    }
  };

  constructor(private http: HttpService) {}

  get() { return this.customers$.asObservable(); }

  list() {
    const {
      currentCategory,
      currentQueryKey,
      currentPagination: {
        PageIndex,
        PageSize
      }
    } = this.state;

    return this.http.post('/Customer/GetListPaged', {
      QueryKey: currentQueryKey,
      CustomerCategoryId: currentCategory.Id,
      CustomerType: 'Customer',
      PageIndex,
      PageSize
    }).subscribe(data => {
      const nextState = {
        ...this.state,
        customers: data.CustomerList,
        currentPagination: data.Pagination
      };

      this.state = nextState;
      this.customers$.next(nextState);
    });
  }

  contactList(customerId) {
    return this.http.get('/CustomerContractor/GetList', {
      customerId
    });
  }

  newOne() {
    const { currentCategory } = this.state;

    return this.http.get('/Customer/GetForNew', {
      customerType: 'Customer',
      customerCategoryId: currentCategory.Id
    });
  }

  detail(customerId) {
    return this.http.get(`/Customer/GetForModify?customerId=${customerId}`);
  }

  create(customer) {
    return this.http.post('/Customer/New', {
      customer
    });
  }

  update(customer) {
    return this.http.post('/Customer/Modify', {
      customer
    });
  }

  cancel(customerIdList) {
    return this.http.post('/Customer/Cancel', {
      customerIdList
    });
  }

  onCategoryChange(selected) {
    const nextState = {
      ...this.state,
      currentCategory: selected
    };

    this.state = nextState;
    this.list();
  }

  onPageChange(pagination) {
    const nextState = {
      ...this.state,
      currentPagination: {
        ...this.state.currentPagination,
        ...pagination
      }
    };

    this.state = nextState;
    this.list();
  }

  onSearch(queryKey) {
    const nextState = {
      ...this.state,
      currentQueryKey: queryKey
    };

    this.state = nextState;
    this.list();
  }
}
