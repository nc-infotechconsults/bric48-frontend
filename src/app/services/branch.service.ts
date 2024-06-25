import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../models/branch';
import axios from 'axios';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http:HttpClient, private roomService:RoomService) { }

  statusCode: number = 0;

  // Get all branches
  async getAll()  : Promise<Branch[]|null> {
    const apiUrl = 'http://localhost:8080/branch/getAll'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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


  // Get branches from to
  async getBranchesFromTo(from: number, to: number) : Promise<Branch[]|null> {
    const apiUrl = 'http://localhost:8080/branch/getBranchesFromTo?from='+from+'&to='+to

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const dataArray: Branch[] = response.data;
      
      return dataArray;

    } catch (error) {
      return null;
    }
  }


  // Get branch by id
  async getById(id: any)  : Promise<Branch|null> {
    const apiUrl = 'http://localhost:8080/branch/findById/'+id

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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

  // Delete branch by id
  async deleteBranch(id: any) : Promise<number> {
    const apiUrl = 'http://localhost:8080/branch/delete/'+id

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.delete(apiUrl, {
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

  // Add a new branch
  async addBranch(branch:Branch): Promise<number> {
    try {
      const data = {name: branch.name, address: branch.address};
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/branch/add', data, {
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


  // Update branch
  async editBranch(branch: Branch) : Promise<number> {

    const apiUrl = 'http://localhost:8080/branch/updateBranch'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const data = {id: branch.id, name: branch.name, address: branch.address};
      const response = await axios.put(apiUrl, data, {
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
