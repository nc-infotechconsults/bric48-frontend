import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Machinery } from '../models/machinery';
import axios from 'axios';
import { NearbyHeadphones } from '../models/nearby-headphones';

@Injectable({
  providedIn: 'root'
})
export class MachineryService {

  constructor(private http:HttpClient) { }

  // Get all machineries
  async getAll()  : Promise<Machinery[]|null> {
    const apiUrl = 'http://localhost:8080/machinery/getAll'

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machineries: Machinery[] = response.data;
      return machineries;

    } catch (error) {
      return null;
    }
  }

  // Get nearby headphones by mserial
  async getNearbyHeadphonesByMserial(mserial: string)  : Promise<NearbyHeadphones[]|null> {
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

}
