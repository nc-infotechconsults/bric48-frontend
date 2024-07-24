import { Component } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';
import { Branch } from '../../models/branch';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss'
})
export class EditRoomComponent {

  room:any = {} as any;
  branches: Branch[] | null = [];

  statusCode: number = 0;

  // id del branch al quale appartiene la room che vogliamo modificare
  idBranch: any = sessionStorage.getItem('idBranch');

  // id della room che vogliamo modificare
  idRoom: any = sessionStorage.getItem('idRoom');

  btnDisabled: boolean = false;

  constructor( private branchService:BranchService, private roomService:RoomService, private logService:LogService, private router: Router) {
  }

   // on init
   async ngOnInit() {
    this.btnDisabled = false;
    
    // ottenimento della room
    this.room = await this.roomService.getById(this.idRoom);

    // ottenimento di tutti i branch
    this.branches = await this.branchService.getAll();
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    // modifica della room
    this.statusCode = await this.roomService.editRoom(this.room, this.idBranch);

    if (this.statusCode == 0){
      window.alert("Room edited!");

      // aggiunta del log
      this.logService.addLog("Edited room "+this.room.name)

      // routing verso la pagina di visualizzazione delle room
      this.router.navigate(['/home/rooms'])
    }

    this.btnDisabled = false;
  }

}
