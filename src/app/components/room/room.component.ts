import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';
import { Machinery } from '../../models/machinery';
import { MachineryService } from '../../services/machinery.service';
import { MachineryDataService } from '../../services/machinery-data.service';
import { MachineryData } from '../../models/machinery-data';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {

  rooms: Room[] | null = [];
  machineries: Machinery[] | null = [];
  alarms: MachineryData[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  intervalId: any;

  idBranch: any = localStorage.getItem('idBranch')

  constructor(private roomService:RoomService, private machineryService:MachineryService, private machineryDataService:MachineryDataService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  async ngOnInit() {
    this.rooms = await this.roomService.getRoomsByIdBranch(this.idBranch);

    this.machineries = await this.machineryService.getMachineryByIdBranch(this.idBranch);

    if (this.machineries) {
      for (const machinery of this.machineries) {
        this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

        if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
          if (this.rooms) {
            for (const room of this.rooms) {
              if(machinery.idRoom == room.id){
                room.dangerousness = "HIGH"
              }
            }
          }
        }

      }
    }

    

    this.startPolling()
  }

  startPolling() {
    this.intervalId = setInterval(async () => {

      this.rooms = await this.roomService.getRoomsByIdBranch(this.idBranch);

      if (this.rooms) {
        for (const room of this.rooms) {
            room.dangerousness = "ZERO"
        }
      }

      this.machineries = await this.machineryService.getMachineryByIdBranch(this.idBranch);

      if (this.machineries) {
        for (const machinery of this.machineries) {
          this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

          if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
            if (this.rooms) {
              for (const room of this.rooms) {
                if(machinery.idRoom == room.id){
                  room.dangerousness = "HIGH"
                }
              }
            }
          }

        }
      }

    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }


  ngOnDestroy() {
    this.stopPolling();
  }

  goToMachineriesPage(idRoom: any) {
    localStorage.setItem('idRoom', idRoom)
    this.router.navigate(['home/machinery']);
  }


}
