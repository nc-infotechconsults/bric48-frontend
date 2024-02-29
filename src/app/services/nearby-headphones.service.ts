import { Injectable } from '@angular/core';
import { NearbyHeadphones } from '../models/nearby-headphones';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NearbyHeadphonesService {

  constructor(private http:HttpClient) { }

  // Get nearby headphones by mserial
  async getNearbyHeadphonesByMserial(mserial: string | undefined)  : Promise<NearbyHeadphones[]|null> {
    const apiUrl = 'http://localhost:8080/nearbyHeadphones/find/'+mserial

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const nearbyHeadphones: NearbyHeadphones[] = response.data;
      return nearbyHeadphones;

    } catch (error) {
      return null;
    }
  }

  // Get nearby headphones by idRoom
  async getNearbyHeadphonesByIdRoom(idRoom: string | undefined)  : Promise<NearbyHeadphones[]|null> {
    const apiUrl = 'http://localhost:8080/nearbyHeadphones/find/room/'+idRoom

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const nearbyHeadphones: NearbyHeadphones[] = response.data;
      return nearbyHeadphones;

    } catch (error) {
      return null;
    }
  }


  // Get nearby headphones by idBranch
  async getNearbyHeadphonesByIdBranch(idBranch: string | undefined)  : Promise<NearbyHeadphones[]|null> {
    const apiUrl = 'http://localhost:8080/nearbyHeadphones/find/branch/'+idBranch

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const nearbyHeadphones: NearbyHeadphones[] = response.data;
      return nearbyHeadphones;

    } catch (error) {
      return null;
    }
  }

}
