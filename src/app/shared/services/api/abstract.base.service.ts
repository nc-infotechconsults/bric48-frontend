import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, ObservableInput, retry, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AbstractBaseService {
  baseUrl = '/';
  resource: string = '';

  private router = inject(Router);
  private http = inject(HttpClient);

  handleError = (err: any, caught: ObservableInput<any>): ObservableInput<any> => {
    console.error("Error happen: ", err);
    // this.toastService.show('Si è verificato un errore: ' + err.message, new ToastOptions('alert alert-danger', 'danger', 10000));
    if (err.status == 401) {
      this.router.navigate(['/auth/login']);
    }
    throw err;
  };

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  buildEndpoint(apiPath: string | undefined): string {
    if (apiPath?.startsWith('/')) {
      apiPath = apiPath.replace('/', '');
    }
    if (apiPath?.length != 0)
      return this.baseUrl + this.resource + '/' + apiPath;
    else {
      return this.baseUrl + this.resource;
    }
  }

  public makePostRequest(
    apiPath: string = '',
    body?: any,
    params?: any,
    catchErrorEnable: boolean = true
  ): any {

    const op = this.http
      .post(this.buildEndpoint(apiPath), body, { ...this.httpOptions, params: params })

    if (catchErrorEnable)
      return op.pipe(retry(1), take(1), catchError(this.handleError));
    else
      return op.pipe(retry(1), take(1));
  }

  public makeGetRequest(
    apiPath: string = '',
    params?: any,
    catchErrorEnable: boolean = true
  ): any {
    const op = this.http
      .get(this.buildEndpoint(apiPath), { ...this.httpOptions, params: params });
    if (catchErrorEnable)
      return op.pipe(retry(1), take(1), catchError(this.handleError));
    else
      return op.pipe(retry(1), take(1));
  }

  public makePutRequest(
    apiPath: string = '',
    body?: any,
    params?: any,
    catchErrorEnable: boolean = true
  ): any {
    const op = this.http
      .put(this.buildEndpoint(apiPath), body, { ...this.httpOptions, params: params });
    if (catchErrorEnable)
      return op.pipe(retry(1), take(1), catchError(this.handleError));
    else
      return op.pipe(retry(1), take(1));
  }

  public makePatchRequest(
    apiPath: string = '',
    body?: any,
    params?: any,
    catchErrorEnable: boolean = true
  ): any {
    const op = this.http
      .patch(this.buildEndpoint(apiPath), body, { ...this.httpOptions, params: params });
    if (catchErrorEnable)
      return op.pipe(retry(1), take(1), catchError(this.handleError));
    else
      return op.pipe(retry(1), take(1));
  }

  public makeDeleteRequest(
    apiPath: string | undefined,
    params?: any,
    catchErrorEnable: boolean = true
  ): any {
    const op = this.http
      .delete(this.buildEndpoint(apiPath), { ...this.httpOptions, params: params });
    if (catchErrorEnable)
      return op.pipe(retry(1), take(1), catchError(this.handleError));
    else
      return op.pipe(retry(1), take(1));
  }

}
