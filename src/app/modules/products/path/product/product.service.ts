import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ProductService {
  private product$ = new Subject<any>();

  private state ={
    product: [],
    currentQueryKey: '',
    currentCategory: { Id: null },
    currentPagination: {
      PageIndex: 1,
      PageSize: 25,
      TotalCount: 0
    }
  };

  constructor(private http: HttpService) {}

  all() {
    return this.http.get('/Product/GetAll');
  }

  get() { return this.product$.asObservable(); }

  list() {
    const {
      currentQueryKey,
      currentCategory,
      currentPagination: {
        PageIndex,
        PageSize
      }
    } = this.state;

    return this.http.post('/Product/GetProductListPaged', {
      QueryKey: currentQueryKey,
      ProductCategoryId:currentCategory.Id,
      Status:1,
      PageIndex,
      PageSize
    }).subscribe(data => {
      const nextState = {
        ...this.state,
        products: data.ProductList,
        currentPagination: data.Pagination
      };

      this.state = nextState;
      this.product$.next(nextState);
    });
  }

  listDisabled() {
    const {
      currentQueryKey,
      currentCategory,
      currentPagination: {
        PageIndex,
        PageSize
      }
    } = this.state;

    return this.http.post('/Product/GetCancelListPaged', {
      QueryKey: currentQueryKey,
      ProductCategoryId:currentCategory.Id,
      Status:-99,
      PageIndex,
      PageSize
    }).subscribe(data => {
      const nextState = {
        ...this.state,
        products: data.ProductList,
        currentPagination: data.Pagination
      };

      this.state = nextState;
      this.product$.next(nextState);
    });
  }

  newOne() {
    const {  } = this.state;

    return this.http.get('/Product/GetForNew', {
    });
  }

  detail(productId) {
    return this.http.get(`/Product/GetForModify?productId=${productId}`);
  }

  create(product) {
    return this.http.post('/Product/New', {
      product
    });
  }

  modify(product){
    return this.http.post('/Product/Modify', {
      product
    });
  }

  cancel(entityIdList) {
    return this.http.post('/Product/Cancel', {
      entityIdList
    });
  }

  remove(entityIdList) {
    return this.http.post('/Product/Remove', {
      entityIdList
    });
  }

  restore(entityIdList) {
    return this.http.post('/Product/Restore', {
      entityIdList
    });
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

  onSearchDisabled(queryKey){
    const nextState = {
      ...this.state,
      currentQueryKey: queryKey
    };

    this.state = nextState;
    this.listDisabled();
  }

  onCategoryChange(selected) {
    const nextState = {
      ...this.state,
      currentCategory: selected
    };

    this.state = nextState;
    this.list();
  }

}
