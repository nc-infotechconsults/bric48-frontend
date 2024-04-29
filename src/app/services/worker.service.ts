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

  // Get all workers
  async getAll() : Promise<Worker[]|null> {
    const apiUrl = 'http://localhost:8080/worker/getAll'

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
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

  // Get worker by id
  async getWorkerById(id: string)  : Promise<Worker|null> {
    const apiUrl = 'http://localhost:8080/worker/findById/'+id

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

  // Add a new worker
  async addWorker(worker:Worker): Promise<number> {
    try {
      const data = {rollNumber: worker.rollNumber, name: worker.name, surname: worker.surname, email: worker.email, phoneNumber: worker.phoneNumber, role: worker.role, idHeadphones: worker.idHeadphones};
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/worker/add', data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento dello stato di associazione delle cuffie da False a True
        if(worker.idHeadphones != ""){
          this.statusCode = await this.headphonesService.updateAssociation(worker.idHeadphones, "True");
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

  // Delete worker by id
  async deleteWorker(id: any, idHeadphones:any) : Promise<number> {
    const apiUrl = 'http://localhost:8080/worker/delete/'+id

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.delete(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento dello stato di associazione delle cuffie da True a False
        this.statusCode = await this.headphonesService.updateAssociation(idHeadphones, "False");
        

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

  // Update idHeadphones
  async updateIdHeadphones(oldIdHeadphones: string, newIdHeadphones: string) : Promise<number> {

    const apiUrl = 'http://localhost:8080/worker/updateIdHeadphones?oldIdHeadphones='+oldIdHeadphones+'&newIdHeadphones='

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

  // Update worker
  async editWorker(worker: Worker) : Promise<number> {

    const apiUrl = 'http://localhost:8080/worker/updateWorker'

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const data = {id: worker.id, rollNumber: worker.rollNumber, name: worker.name, surname: worker.surname, email: worker.email, phoneNumber: worker.phoneNumber, role: worker.role, idHeadphones: worker.idHeadphones};
      const response = await axios.put(apiUrl, data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento dello stato di associazione delle cuffie da False a True
        if(worker.idHeadphones != ""){
          this.statusCode = await this.headphonesService.updateAssociation(worker.idHeadphones, "True");
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

}
