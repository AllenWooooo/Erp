import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

interface BodyMethodOption {
  params: Object;
  headers: Object;
}

@Injectable()
export class HttpService {
  private methods: Array<string> = ['get', 'delete'];
  private bodyMethods: Array<string> = ['post', 'put', 'patch'];

  public get: any;
  public delete: any;
  public post: any;
  public put: any;
  public patch: any;

  constructor(private http: HttpClient) {
    this.init();
  }

  init() {
    for (const method of this.methods) {
      this[method] = (url: string, params?: Object, option?: Object) => {
        return this.request(method, url, params, option);
      };
    }

    for (const method of this.bodyMethods) {
      this[method] = (url: string, body: any, option?: BodyMethodOption) => {
        return this.requestWithBody(method, url, body, option);
      };
    }
  }

  private parseParams(params: any): HttpParams {
    let ret = new HttpParams();

    if (params) {
      for (const key in params) {
        if (typeof params[key] !== 'undefined') {
          ret = ret.set(key, `${params[key]}`);
        }
      }
    }

    return ret;
}

  private request(method: string, url: string, params?: Object, option?: Object) {
    return this.http[method](url, {
      ...option,
      params: this.parseParams(params)
    });
  }

  private requestWithBody(method: string, url: string, body: any, option?: BodyMethodOption) {
    return this.http[method](url, body, {
      ...option,
      params: option ? this.parseParams(option.params) : undefined
    });
  }
}
