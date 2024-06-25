import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MachineryData } from '../models/machinery-data';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MachineryDataService {

  constructor(private http:HttpClient) { }

  // Get machineryData by type and mserial and isSolved
  async getMachineryDataByTypeAndMserialAndIsSolved(type: string, mserial: string, isSolved: string)  : Promise<MachineryData[]|null> {
    const apiUrl = 'http://localhost:8080/data/find/machinery?type='+type+'&mserial='+mserial+'&isSolved=False'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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

  // Get all data
  async getAll() : Promise<MachineryData[]|null> {
    const apiUrl = 'http://localhost:8080/data/getAll'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const dataArray: MachineryData[] = response.data;
      return dataArray;

    } catch (error) {
      return null;
    }
  }


  // Get data from to
  async getDataFromTo(from: number, to: number, searchedMserial: string, searchedType: string, startDate: string, endDate: string) : Promise<MachineryData[]|null> {
    
    if(searchedType == "all types"){
      searchedType = ""
    }

    const apiUrl = 'http://localhost:8080/data/getDataFromTo?from='+from+'&to='+to+'&mserial='+searchedMserial+'&type='+searchedType+'&startDate='+startDate+'&endDate='+endDate

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const dataArray: MachineryData[] = response.data;
      
      return dataArray;

    } catch (error) {
      return null;
    }
  }

  // Get data filtered
  async getDataFiltered(searchedMserial: string, searchedType: string, startDate: string, endDate: string,) : Promise<MachineryData[]|null> {
    
    if(searchedType == "all types"){
      searchedType = ""
    }
    
    const apiUrl = 'http://localhost:8080/data/getDataFiltered?mserial='+searchedMserial+'&type='+searchedType+'&startDate='+startDate+'&endDate='+endDate

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const dataArray: MachineryData[] = response.data;
      
      return dataArray;

    } catch (error) {
      return null;
    }
  }

  // Update isSolved
  async solveAlarm(id: string) : Promise<number> {

    const apiUrl = 'http://localhost:8080/data/updateIsSolved?id='+id

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.put(apiUrl, {}, {
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



}
