import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '../models/log';
import axios from 'axios';
import { timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http:HttpClient) { }

  // Get all logs
  async getAll() : Promise<Log[]|null> {
    const apiUrl = 'http://localhost:8080/log/getAll'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const logs: Log[] = response.data;
      return logs;

    } catch (error) {
      return null;
    }
  }

   // Add a new log
   async addLog(log: string): Promise<number> {
    try {

      const date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Aggiungi 1 perché i mesi in JavaScript partono da 0
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);

      const formattedTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

      const data = {log: log, timestamp:formattedTimestamp};

      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/log/add', data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Get logs from to
  async getLogsFromTo(from: number, to: number, searchedText: string, startDate: string, endDate: string) : Promise<Log[]|null> {

    const apiUrl = 'http://localhost:8080/log/getLogsFromTo?from='+from+'&to='+to+'&text='+searchedText+'&startDate='+startDate+'&endDate='+endDate

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const logs: Log[] = response.data;
      
      return logs;

    } catch (error) {
      return null;
    }
  }

  // Get logs filtered
  async getLogsFiltered(searchedText: string, startDate: string, endDate: string,) : Promise<Log[]|null> {
        
    const apiUrl = 'http://localhost:8080/log/getLogsFiltered?text='+searchedText+'&startDate='+startDate+'&endDate='+endDate

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const logs: Log[] = response.data;
      
      return logs;

    } catch (error) {
      return null;
    }
  }

}
