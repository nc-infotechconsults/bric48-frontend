import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient, private router:Router) {

  }

  // Login
  async loginAdmin(email: string, password: string): Promise<number> {
    try {
      const data = {email: email, password: password};
      const response = await axios.post('http://localhost:8080/admin/authenticate', data);
      const responseString = JSON.stringify(response.data);

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        const jsonObject = JSON.parse(responseString);
        localStorage.setItem('token', JSON.stringify(jsonObject))

        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }
  
}
