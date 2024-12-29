import { Injectable } from '@angular/core';
import { MachineryNotification } from '../../model/domain/machinery-notification';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MachineryNotificationService extends BaseService<MachineryNotification, any> {
  override resource = '/machineryNotifications';

  resolve(id: string){
    return this.makePatchRequest(`/${id}/solve`);
  }
}
