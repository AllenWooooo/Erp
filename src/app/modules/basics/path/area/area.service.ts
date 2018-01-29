import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class AreaService {
  private area$ = new Subject<any>();

  constructor(private http: HttpService) {}

  all() {
    return this.http.get('/Area/GetAll');
  }
}
