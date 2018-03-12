import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class DepartmentService {
  private department$ = new Subject<any>();
  
  private state ={
    department: [],
    currentQueryKey: '',
    currentDepartment: { Id: null },
    currentPagination: {
      PageIndex: 1,
      PageSize: 25,
      TotalCount: 0
    }
  };

  constructor(private http: HttpService) {}

  all() {
    return this.http.get('/Department/GetAll');
  }

  dropdownlist(){
      return this.http.get('/Department/GetDropdownList');
  }

  get() { return this.department$.asObservable(); }

  list() {
    const {
      currentQueryKey,
      currentPagination: {
        PageIndex,
        PageSize
      }
    } = this.state;

    return this.http.post('/Department/GetListPaged', {
      QueryKey: currentQueryKey,
      Status:1,
      PageIndex,
      PageSize
    }).subscribe(data => {
      const nextState = {
        ...this.state,
        departments: data.DepartmentList,
        currentPagination: data.Pagination
      };

      this.state = nextState;
      this.department$.next(nextState);
    });
  }

  newOne() {
    const { currentDepartment } = this.state;

    return this.http.get('/Department/GetForNew', {
    });
  }

  detail(departmentId) {
    return this.http.get(`/Department/GetForModify?departmentId=${departmentId}`);
  }

  create(department) {
    return this.http.post('/Department/New', {
      department
    });
  }

  modify(department){
    return this.http.post('/Department/Modify', {
      department
    });
  }

  cancel(entityIdList) {
    return this.http.post('/Department/Cancel', {
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
}
