import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../models/room';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http:HttpClient) { }

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

}
