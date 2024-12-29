import { Injectable } from '@angular/core';
import { NotificationCode } from '../../model/domain/notification-code';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationCodeService extends BaseService<NotificationCode, any> {
  override resource = '/notificationCodes';
}
