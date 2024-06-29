import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient) { }

  // Get all messages
  async getAll() : Promise<Message[]|null> {
    const apiUrl = 'http://localhost:8080/message/getAll'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const messages: Message[] = response.data;
      return messages;

    } catch (error) {
      return null;
    }
  }

  // Get message from-to
  async getMessagesFromTo(from: number, to: number) : Promise<Message[]|null> {
    const apiUrl = 'http://localhost:8080/message/getMessagesFromTo?from='+from+'&to='+to

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const messages: Message[] = response.data;
      return messages;

    } catch (error) {
      return null;
    }
  }

  // Add a new message
  async addMessage(message:Message): Promise<number> {
    try {
      const data = {message: message.message};
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/message/add', data, {
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

  // Delete message
  async deleteMessage(id: string) : Promise<number> {
    const apiUrl = 'http://localhost:8080/message/delete/'+id

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
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
