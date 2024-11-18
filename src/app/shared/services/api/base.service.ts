import { Injectable } from '@angular/core';

import { AbstractBaseService } from './abstract.base.service';

import { Observable } from 'rxjs';
import { FiltersDTO } from 'src/app/model/api/filters-dto';
import { Page } from 'src/app/model/api/page';
import { Pageable } from 'src/app/model/api/pageable';


@Injectable({
  providedIn: 'root',
})
export class BaseService<ENTITY, DTO> extends AbstractBaseService {

  override baseUrl: string = '/api';

  delete(id: any): Observable<any> {
    return this.makeDeleteRequest(`/${id}`);
  };

  getById(id: any): Observable<ENTITY> {
    return this.makeGetRequest(`/${id}`);
  }

  update(id: any, data: DTO): Observable<ENTITY> {
    return this.makePutRequest(`/${id}`, data);
  }

  save(data: DTO): Observable<ENTITY> {
    return this.makePostRequest('', data);
  }

  search(filters: FiltersDTO, page: Pageable, unpaged: boolean = false): Observable<Page<ENTITY>> {
    const params = {
      ...page,
      ...page.sort,
      unpaged
    }
    return this.makePostRequest('/search', filters, params);
  }

}
