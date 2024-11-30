import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class DefaultMessageService<DefaultMessage, DefaultMessageDTO> extends BaseService<DefaultMessage, DefaultMessageDTO> {
  override resource = '/defaultMessages';
}
