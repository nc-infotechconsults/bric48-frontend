import { Component } from '@angular/core';
import { Branch } from '../../models/branch';
import { Room } from '../../models/room';
import { MachineryService } from '../../services/machinery.service';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-edit-machinery',
  templateUrl: './edit-machinery.component.html',
  styleUrl: './edit-machinery.component.scss'
})
export class EditMachineryComponent {

  machinery:any = {} as any;
  branches: Branch[] | null = [];
  rooms: Room[] | null = [];

  mserial: any = sessionStorage.getItem('mserial');

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private machineryService:MachineryService, private branchService:BranchService, private roomService:RoomService, private logService:LogService, private router: Router) {
  }

   //On init
   async ngOnInit() {
    this.btnDisabled = false;
    this.machinery = await this.machineryService.getMachineryByMserial(this.mserial);
    this.branches = await this.branchService.getAll();
    this.rooms = await this.roomService.getRoomsByIdBranch(this.machinery.idBranch);
  }

  async onBranchChange(event: Event) {
    let selectedIdBranch = (event.target as HTMLSelectElement).value;
    this.rooms = await this.roomService.getRoomsByIdBranch(selectedIdBranch);
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.machinery.topic = '/'+this.machinery.mserial
    this.statusCode = await this.machineryService.editMachinery(this.machinery);

    if (this.statusCode == 0){
      window.alert("Machinery edited!");
      this.logService.addLog("Edited machinery with mserial: "+this.machinery.mserial)
      this.router.navigate(['/home/machineries'])
    }

    this.btnDisabled = false;
  }


}
