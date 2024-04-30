import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrl: './new-room.component.scss'
})
export class NewRoomComponent {

  room:Room = {} as Room;

  branchName: string | null = localStorage.getItem('branchName')

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor( private roomService:RoomService, private router: Router) {
  }

  async ngOnInit(){
    this.btnDisabled = false;
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.room.idBranch = localStorage.getItem('idBranch')!

    this.statusCode = await this.roomService.addRoom(this.room);

    if (this.statusCode == 0){
      window.alert("New room added!");
      this.router.navigate(['/home/rooms'])
    }

    this.btnDisabled = false;
  }

}
