import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class FeeTypeService {
  private feeTypes$ = new Subject<any>();
  private state = {
    feeTypes: [],
    currentQueryKey: '',
    currentPagination: {
      PageIndex: 1,
      PageSize: 25,
      TotalCount: 0
    }
  };

  constructor(private http: HttpService) {}

  get() { return this.feeTypes$.asObservable(); }

  list() {
    const {
      currentQueryKey,
      currentPagination: {
        PageIndex,
        PageSize
      }
    } = this.state;

    return this.http.post('/FeeType/GetListPaged', {
      QueryKey: currentQueryKey,
      BlanceType: 'Fee',
      PageIndex,
      PageSize
    }).subscribe(data => {
      const nextState = {
        ...this.state,
        feeTypes: data.FeeTypeList,
        currentPagination: data.Pagination
      };

      this.state = nextState;
      this.feeTypes$.next(nextState);
    });
  }

  newOne() {
    return this.http.get('/FeeType/GetForModify');
  }

  detail(feeTypeId) {
    return this.http.get(`/FeeType/GetForModify?feeTypeId=${feeTypeId}`);
  }

  create(feeType) {
    return this.http.post('/FeeType/New', {
      feeType
    });
  }

  update(feeType) {
    return this.http.post('/FeeType/Modify', {
      feeType
    });
  }

  cancel(feeTypeIdList) {
    return this.http.post('/FeeType/Cancel', {
      feeTypeIdList
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
}
