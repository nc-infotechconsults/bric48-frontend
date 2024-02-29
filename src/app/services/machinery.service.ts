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

  // Get machineries by idRoom
  async getMachineryByIdRoom(idRoom: string)  : Promise<Machinery[]|null> {
    const apiUrl = 'http://localhost:8080/machinery/find/'+idRoom

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

  // Get machinery by mserial
  async getMachineryByMserial(mserial: string)  : Promise<Machinery|null> {
    const apiUrl = 'http://localhost:8080/machinery/find/machinery/'+mserial

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machinery: Machinery = response.data;
      return machinery;

    } catch (error) {
      return null;
    }
  }


}
