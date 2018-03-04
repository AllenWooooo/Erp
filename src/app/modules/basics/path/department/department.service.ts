import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class DepartmentService {
  private department$ = new Subject<any>();

  constructor(private http: HttpService) {}

  all() {
    return this.http.get('/Department/GetAll');
  }

  dropdownlist(){
      return this.http.get('/Department/GetDropdownList');
  }
}
