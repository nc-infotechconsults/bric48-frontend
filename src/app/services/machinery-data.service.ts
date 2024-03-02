import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MachineryData } from '../models/machinery-data';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MachineryDataService {

  constructor(private http:HttpClient) { }

  // Get machineryData by type and mserial
  async getMachineryDataByTypeAndMserial(type: string, mserial: string)  : Promise<MachineryData[]|null> {
    const apiUrl = 'http://localhost:8080/data/find?type='+type+'&mserial='+mserial

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machineryData: MachineryData[] = response.data;
      return machineryData.reverse();

    } catch (error) {
      return null;
    }
  }
}
