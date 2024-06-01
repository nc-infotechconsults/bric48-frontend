import { Component } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';
import { Branch } from '../../models/branch';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss'
})
export class EditRoomComponent {

  room:any = {} as any;
  branches: Branch[] | null = [];

  statusCode: number = 0;

  idBranch: any = sessionStorage.getItem('idBranch');
  idRoom: any = sessionStorage.getItem('idRoom');

  btnDisabled: boolean = false;

  constructor( private branchService:BranchService, private roomService:RoomService, private router: Router) {
  }

   //On init
   async ngOnInit() {
    this.btnDisabled = false;
    this.room = await this.roomService.getById(this.idRoom);
    this.branches = await this.branchService.getAll();
  }


  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.statusCode = await this.roomService.editRoom(this.room, this.idBranch);

    if (this.statusCode == 0){
      window.alert("Room edited!");
      this.router.navigate(['/home/rooms'])
    }

    this.btnDisabled = false;
  }

}
