import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../models/room';
import axios from 'axios';
import { MachineryService } from './machinery.service';
import { Machinery } from '../models/machinery';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http:HttpClient, private machineryService:MachineryService) { }

  statusCode: number = 0;

  // Get rooms by idBranch
  async getRoomsByIdBranch(idBranch: string)  : Promise<Room[]|null> {
    const apiUrl = 'http://localhost:8080/room/find/'+idBranch

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const rooms: Room[] = response.data;
      return rooms;

    } catch (error) {
      return null;
    }
  }

  // Get room by id
  async getById(id: any)  : Promise<Room|null> {
    const apiUrl = 'http://localhost:8080/room/findById/'+id

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const room: Room = response.data;
      return room;

    } catch (error) {
      return null;
    }
  }

  // Delete room by id
  async deleteRoom(id: any) : Promise<number> {
    const apiUrl = 'http://localhost:8080/room/delete/'+id

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.delete(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento del campo idRoom del machinery
        this.statusCode = await this.machineryService.updateMachineriesByIdRoom(id, "")
        
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
  
  // Delete rooms by idBranch
  async deleteRoomsByIdBranch(idBranch: any) : Promise<number> {
    const apiUrl = 'http://localhost:8080/room/deleteByBranch/'+idBranch

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.delete(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento del campo idRoom e idBranch del machinery
        this.statusCode = await this.machineryService.updateMachineriesByIdBranch(idBranch, "", "")
        
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


  // Add a new room
  async addRoom(room:Room): Promise<number> {
    try {
      const data = {name: room.name, idBranch: room.idBranch};
      var token = JSON.parse(localStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/room/add', data, {
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


  // Update room
  async editRoom(room: Room, oldIdBranch: string) : Promise<number> {

    const apiUrl = 'http://localhost:8080/room/updateRoom'

    try {
      var token = JSON.parse(localStorage.getItem('token')!)
      const data = {id: room.id, name: room.name, idBranch: room.idBranch};
      const response = await axios.put(apiUrl, data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento del campo idRoom e idBranch del machinery
        this.statusCode = await this.machineryService.updateMachineriesByIdBranch(oldIdBranch, room.idBranch, room.id)
        
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
