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
  rooms_view: Room[] | null = [];
  machineries: Machinery[] | null = [];
  alarms: MachineryData[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  intervalId: any;

  idBranch: any = sessionStorage.getItem('idBranch')

  constructor(private roomService:RoomService, private machineryService:MachineryService, private machineryDataService:MachineryDataService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    // ottenimento delle room da visualizzare
    this.rooms_view = await this.roomService.getRoomsByIdBranch(this.idBranch);

    if (this.rooms_view) {
      for (const room of this.rooms_view) {
          room.dangerousness = "ZERO"
      }
    }

    // ottenimento dei macchinari appartenenti ad un branch
    this.machineries = await this.machineryService.getMachineryByIdBranch(this.idBranch);

    if (this.machineries) {
      // per ogni macchinario
      for (const machinery of this.machineries) {

        // ottenimento degli allarmi non risolti per quel macchianario
        this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");

        // ottenimento dei lavoratori nelle vicinanze del macchinario
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

        // se ci sono allarmi e lavoratori nelle vicinanze, imposto il parametro dangerousness a HIGH
        if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
          if (this.rooms_view) {
            for (const room of this.rooms_view) {
              if(machinery.idRoom == room.id){
                room.dangerousness = "HIGH"
              }
            }
          }
        }

      }
    }

    // inizio del polling
    this.startPolling()
  }

  // polling
  startPolling() {
    this.intervalId = setInterval(async () => {

      // ottenimento delle room
      this.rooms = await this.roomService.getRoomsByIdBranch(this.idBranch);

      if (this.rooms) {
        for (const room of this.rooms) {
            room.dangerousness = "ZERO"
        }
      }

      // ottenimento dei macchinari appartenenti ad un branch
      this.machineries = await this.machineryService.getMachineryByIdBranch(this.idBranch);

      if (this.machineries) {
        // per ogni macchinario
        for (const machinery of this.machineries) {

          // ottenimento degli allarmi non risolti per quel macchianario
          this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");

          // ottenimento dei lavoratori nelle vicinanze del macchinario
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

          // se ci sono allarmi e lavoratori nelle vicinanze, imposto il parametro dangerousness a HIGH
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

      // se rooms_view è diversa da rooms, aggiorno le room da visualizzare
      if (!this.isEqual(this.rooms_view, this.rooms)){
        this.rooms_view = this.rooms
      }

    }, 1000); // Esegui ogni secondo
  }

  // fine del polling
  stopPolling() {
    clearInterval(this.intervalId);
  }

  // on destroy
  ngOnDestroy() {
    this.stopPolling();
  }

  // routing verso la pagina di visualizzazione dei macchinari
  goToMachineriesPage(idRoom: any) {
    sessionStorage.setItem('idRoom', idRoom)
    this.router.navigate(['home/machinery']);
  }

  // funzione per confrontare due array di oggetti
  isEqual(a: object[] | any , b: object[] | any): boolean {
    if (a?.length !== b?.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
            return false;
        }
    }
    return true;
  }


}
