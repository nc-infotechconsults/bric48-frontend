import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {

  rooms: Room[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  intervalId: any;

  idBranch: any = localStorage.getItem('idBranch')

  constructor(private roomService:RoomService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  async ngOnInit() {
    this.rooms = await this.roomService.getRoomsByIdBranch(this.idBranch);

    if (this.rooms) {
      for (const room of this.rooms) {
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByIdRoom(room.id);
        // Ottieni i valori distinti del campo 'serial'
        const distinctSerials = Array.from(new Set(this.nearbyHeadphones?.map(obj => obj.serial)));
        room.workers_count = distinctSerials.length;
      }
    }

    this.startPolling()
  }

  startPolling() {
    this.intervalId = setInterval(async () => {

      this.rooms = await this.roomService.getRoomsByIdBranch(this.idBranch);

      if (this.rooms) {
        for (const room of this.rooms) {
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByIdRoom(room.id);
          // Ottieni i valori distinti del campo 'serial'
          const distinctSerials = Array.from(new Set(this.nearbyHeadphones?.map(obj => obj.serial)));
          room.workers_count = distinctSerials.length;
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
