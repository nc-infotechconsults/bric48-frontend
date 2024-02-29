import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor(private http:HttpClient) { }

  // Get worker by serial
  async getWorkerBySerial(serial: string)  : Promise<Worker|null> {
    const apiUrl = 'http://localhost:8080/worker/find/'+serial

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const worker: Worker = response.data;
      return worker;

    } catch (error) {
      return null;
    }
  }
}
