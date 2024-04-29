import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../models/branch';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http:HttpClient) { }

  // Get all branches
  async getAll()  : Promise<Branch[]|null> {
    const apiUrl = 'http://localhost:8080/branch/getAll'

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const branches: Branch[] = response.data;
      return branches;

    } catch (error) {
      return null;
    }
  }


  // Get branch by id
  async getById(id: any)  : Promise<Branch|null> {
    const apiUrl = 'http://localhost:8080/branch/findById/'+id

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const branch: Branch = response.data;
      return branch;

    } catch (error) {
      return null;
    }
  }
  
}
