import { Injectable } from '@angular/core';
import { DefaultMessage } from '../../model/domain/default-message';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class DefaultMessageService extends BaseService<DefaultMessage, any> {
  override resource = '/defaultMessages';
}
