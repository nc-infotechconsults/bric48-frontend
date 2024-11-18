import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class HeadphoneService<Headphone, HeadphoneDTO> extends BaseService<Headphone, HeadphoneDTO> {
  override resource = '/headphones';
}
