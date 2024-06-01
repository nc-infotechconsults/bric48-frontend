import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sensor } from '../models/sensor';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(private http:HttpClient) { }

  // Get all sensors
  async getAll() : Promise<Sensor[]|null> {
    const apiUrl = 'http://localhost:8080/beacon/getAll'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const sensors: Sensor[] = response.data;
      return sensors;

    } catch (error) {
      return null;
    }
  }


  // Get sensors from-to
  async getSensorsFromTo(from: number, to: number) : Promise<Sensor[]|null> {
    const apiUrl = 'http://localhost:8080/beacon/getBeaconsFromTo?from='+from+'&to='+to

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const sensors: Sensor[] = response.data;
      return sensors;

    } catch (error) {
      return null;
    }
  }

  // Add a new sensor
  async addSensor(sensor:Sensor): Promise<number> {
    try {
      const data = {mac: sensor.mac, mserial:sensor.mserial};
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/beacon/add', data, {
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

  // Delete sensor by mac
  async deleteSensor(mac: string) : Promise<number> {
    const apiUrl = 'http://localhost:8080/beacon/delete/'+mac

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

  // Get sensor by mac
  async getSensorByMac(mac: string)  : Promise<Sensor|null> {
    const apiUrl = 'http://localhost:8080/beacon/findByMac/'+mac

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const sensor: Sensor = response.data;
      return sensor;

    } catch (error) {
      return null;
    }
  }


  // Update sensor
  async editSensor(sensor: Sensor) : Promise<number> {

    const apiUrl = 'http://localhost:8080/beacon/updateBeacon'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const data = {id: sensor.id, mac: sensor.mac, mserial: sensor.mserial};
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


  // Update mserial
  async updateMserial(oldMserial: string, newMserial: string) : Promise<number> {

    const apiUrl = 'http://localhost:8080/beacon/updateMserial?oldMserial='+oldMserial+'&newMserial='+newMserial

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

}
