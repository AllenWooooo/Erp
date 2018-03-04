import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class EmployeeService {
  private employee$ = new Subject<any>();
  
  private state ={
    employee: [],
    currentQueryKey: '',
    currentDepartment: { Id: null },
    currentPagination: {
      PageIndex: 1,
      PageSize: 25,
      TotalCount: 0
    }
  };


  constructor(private http: HttpService) {
  }

  all() {
    return this.http.get('/employee/GetAll');
  }

  get() { return this.employee$.asObservable(); }

  list() {
    const {
      currentDepartment,
      currentQueryKey,
      currentPagination: {
        PageIndex,
        PageSize
      }
    } = this.state;

    return this.http.post('/Employee/GetListPaged', {
      QueryKey: currentQueryKey,
      DepartmentId: currentDepartment.Id,
      Status:1,
      PageIndex,
      PageSize
    }).subscribe(data => {
      const nextState = {
        ...this.state,
        employees: data.EmployeeList,
        currentPagination: data.Pagination
      };

      this.state = nextState;
      this.employee$.next(nextState);
    });
  }

  newOne() {
    const { currentDepartment } = this.state;

    return this.http.get('/Employee/GetForNew', {
    });
  }

  detail(employeeId) {
    console.log(employeeId);
    return this.http.get(`/Employee/GetForModify?employeeId=${employeeId}`);
  }

  create(employee) {
    return this.http.post('/Employee/New', {
      employee
    });
  }

  cancel(employeeIdList) {
    return this.http.post('/Employee/Cancel', {
      employeeIdList
    });
  }

  onDepartmentChange(selected) {
    const nextState = {
      ...this.state,
      currentDepartment: selected
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
