import { Injectable } from '@angular/core';
import { Message } from '../../model/domain/message';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends BaseService<Message, any> {
  override resource = '/messages';
}
