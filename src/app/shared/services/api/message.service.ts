import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService<Message, MessageDTO> extends BaseService<Message, MessageDTO> {
  override resource = '/messages';
}
