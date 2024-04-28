import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headphones } from '../models/headphones';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class HeadphonesService {

  constructor(private http:HttpClient) { }

  // Get all headphones
  async getAll() : Promise<Headphones[]|null> {
    const apiUrl = 'http://localhost:8080/headphones/getAll'

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const headphones: Headphones[] = response.data;
      return headphones;

    } catch (error) {
      return null;
    }
  }

  // Get headphones by isAssociated
  async getByIsAssociated(isAssociated: string) : Promise<Headphones[]|null> {
    const apiUrl = 'http://localhost:8080/headphones/find/'+isAssociated

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const headphones: Headphones[] = response.data;
      return headphones;

    } catch (error) {
      return null;
    }
  }

  // Add a new headphones
  async addHeadphones(headphones:Headphones): Promise<number> {
    try {
      const data = {serial: headphones.serial, isAssociated:"False"};
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/headphones/add', data, {
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

  // Update association
  async updateAssociation(serial: string, isAssociated: string) : Promise<number> {

    const apiUrl = 'http://localhost:8080/headphones/updateAssociation?serial='+serial+'&isAssociated='+isAssociated

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
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


  // Delete headphones
  async deleteHeadphones(serial: string) : Promise<number> {
    const apiUrl = 'http://localhost:8080/headphones/delete/'+serial

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.delete(apiUrl, {
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
