import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MachineryNotificationService<MachineryNotification, MachineryNotificationDTO> extends BaseService<MachineryNotification, MachineryNotificationDTO> {
  override resource = '/machineryNotifications';

  resolve(id: string){
    return this.makePatchRequest(`/${id}/solve`);
  }
}
