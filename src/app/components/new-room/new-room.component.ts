import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrl: './new-room.component.scss'
})
export class NewRoomComponent {

  room:Room = {} as Room;

  branchName: string | null = sessionStorage.getItem('branchName')

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor( private roomService:RoomService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit(){
    this.btnDisabled = false;
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.room.idBranch = sessionStorage.getItem('idBranch')!

    // aggiunta della stanza
    this.statusCode = await this.roomService.addRoom(this.room);

    if (this.statusCode == 0){
      window.alert("New room added!");

      // aggiunta del log
      this.logService.addLog("Added room "+this.room.name)

      // routing verso la pagina di visualizzazione delle room
      this.router.navigate(['/home/rooms'])
    }

    this.btnDisabled = false;
  }

}
