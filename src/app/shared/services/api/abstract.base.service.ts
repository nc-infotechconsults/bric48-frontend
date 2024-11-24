import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { catchError, ObservableInput, retry, take } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AbstractBaseService {
  protected baseUrl = '/';
  protected resource: string = '';

  private messageService = inject(MessageService);
  private appConfigSevice = inject(AppConfigService);
  private translateService = inject(TranslateService);
  private http = inject(HttpClient);
  private layout = inject(LayoutService);

  protected handleError = (err: any, caught: ObservableInput<any>): ObservableInput<any> => {
    console.error("Error happen: ", err);
    this.messageService.add({
      severity: 'error',
      summary: this.translateService.instant('shared.errors.genericError.summary'),
      detail: `${this.translateService.instant('shared.errors.genericError.detail')} (${err.status} - ${err.statusText})`,
    });
    if (err.status == 401 || err.status === 403) {
      this.appConfigSevice.cleanAccessToken();
    }
    this.layout.isLoading.set(false);
    throw err;
  };

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  protected buildEndpoint(apiPath: string | undefined): string {
    if (apiPath?.startsWith('/')) {
      apiPath = apiPath.replace('/', '');
    }
    if (apiPath?.length != 0)
      return this.baseUrl + this.resource + '/' + apiPath;
    else {
      return this.baseUrl + this.resource;
    }
  }

  protected makePostRequest(
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

  protected makeGetRequest(
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

  protected makePutRequest(
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

  protected makePatchRequest(
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

  protected makeDeleteRequest(
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
