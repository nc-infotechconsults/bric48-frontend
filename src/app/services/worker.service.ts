import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Worker } from '../models/worker';
import axios from 'axios';
import { HeadphonesService } from './headphones.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  statusCode: number = 0;

  constructor(private http:HttpClient, private headphonesService: HeadphonesService) { }

  // Login
  async loginWorker(email: string, password: string): Promise<number> {
    try {
      const data = {email: email, password: password};
      const response = await axios.post('http://localhost:8080/worker/authenticate', data);
      const responseString = JSON.stringify(response.data);

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        const jsonObject = JSON.parse(responseString);

        sessionStorage.setItem('token', JSON.stringify(jsonObject))
        sessionStorage.setItem('email', email)
        sessionStorage.setItem('role', 'SECURITY MANAGER')

        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Get all workers
  async getAll() : Promise<Worker[]|null> {
    const apiUrl = 'http://localhost:8080/worker/getAll'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const workers: Worker[] = response.data;
      return workers;

    } catch (error) {
      return null;
    }
  }


  // Get workers from-to
  async getWorkersFromTo(from: number, to: number) : Promise<Worker[]|null> {
    const apiUrl = 'http://localhost:8080/worker/getWorkersFromTo?from='+from+'&to='+to

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const workers: Worker[] = response.data;
      return workers;

    } catch (error) {
      return null;
    }
  }

  // Get worker by serial
  async getWorkerBySerial(serial: string)  : Promise<Worker|null> {
    const apiUrl = 'http://localhost:8080/worker/find/'+serial

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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

  // Get worker by id
  async getWorkerById(id: string)  : Promise<Worker|null> {
    const apiUrl = 'http://localhost:8080/worker/findById/'+id

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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

  // Add a new worker
  async addWorker(worker:Worker): Promise<number> {
    try {
      let data = {}
      if(worker.password == ""){
        data = {rollNumber: worker.rollNumber, name: worker.name, surname: worker.surname, email: worker.email, phoneNumber: worker.phoneNumber, role: worker.role, idHeadphones: worker.idHeadphones};
      }else{
        data = {rollNumber: worker.rollNumber, name: worker.name, surname: worker.surname, email: worker.email, password: worker.password, phoneNumber: worker.phoneNumber, role: worker.role, idHeadphones: worker.idHeadphones};
      }
  
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/worker/add', data, {
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

  // Delete worker by id
  async deleteWorker(id: any, idHeadphones:any) : Promise<number> {
    const apiUrl = 'http://localhost:8080/worker/delete/'+id

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

  // Update idHeadphones
  async updateIdHeadphones(oldIdHeadphones: string, newIdHeadphones: string) : Promise<number> {

    const apiUrl = 'http://localhost:8080/worker/updateIdHeadphones?oldIdHeadphones='+oldIdHeadphones+'&newIdHeadphones='

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

  // Update worker
  async editWorker(oldIdHeadphones: string, worker: Worker) : Promise<number> {

    const apiUrl = 'http://localhost:8080/worker/updateWorker'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)

      let data = {}
      if(worker.password == ""){
        data = {id: worker.id, rollNumber: worker.rollNumber, name: worker.name, surname: worker.surname, email: worker.email, phoneNumber: worker.phoneNumber, role: worker.role, idHeadphones: worker.idHeadphones};
      }else{
        data = {id: worker.id, rollNumber: worker.rollNumber, name: worker.name, surname: worker.surname, email: worker.email, password: worker.password, phoneNumber: worker.phoneNumber, role: worker.role, idHeadphones: worker.idHeadphones};
      }
      
      const response = await axios.put(apiUrl, data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento dello stato di associazione delle vecchie cuffie da True a False
        if(oldIdHeadphones != worker.idHeadphones && oldIdHeadphones != ""){
          this.statusCode = await this.headphonesService.updateAssociation(oldIdHeadphones, "False");
        }

        if (this.statusCode == 0){
          return 0; // Restituisce 0 se la richiesta è andata bene
        }else {
          return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
        }

      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }


  // Get worker by email
  async getWorkerByEmail(email: string | null)  : Promise<Worker|null> {
    const apiUrl = 'http://localhost:8080/worker/findByEmail?email='+email

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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


  // Get worker by rollNumber
  async getWorkerByRollNumber(rollNumber: string)  : Promise<Worker|null> {
    const apiUrl = 'http://localhost:8080/worker/findByRollNumber?rollNumber='+rollNumber

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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
