import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Admin } from '../models/admin';

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

        sessionStorage.setItem('token', JSON.stringify(jsonObject))
        sessionStorage.setItem('email', email)

        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Get admin by email
  async getAdminByEmail(email: string | null)  : Promise<Admin|null> {
    const apiUrl = 'http://localhost:8080/admin/find/'+email

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const admin: Admin = response.data;
      return admin;

    } catch (error) {
      return null;
    }
  }

  // Update admin
  async editAdmin(admin: Admin) : Promise<number> {

    const apiUrl = 'http://localhost:8080/admin/updateAdmin'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const data = {id: admin.id, name: admin.name, surname: admin.surname, email: admin.email, password: admin.password, phoneNumber: admin.phoneNumber};
      const response = await axios.put(apiUrl, data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        return 0;
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }
  
}
