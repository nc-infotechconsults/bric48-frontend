import { Component } from '@angular/core';
import { Machinery } from '../../models/machinery';
import { Branch } from '../../models/branch';
import { MachineryService } from '../../services/machinery.service';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-new-machinery',
  templateUrl: './new-machinery.component.html',
  styleUrl: './new-machinery.component.scss'
})
export class NewMachineryComponent {

  machinery:Machinery = {} as Machinery;

  branches: Branch[] | null = [];
  rooms: Room[] | null = [];

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private machineryService:MachineryService, private branchService:BranchService, private roomService:RoomService, private router: Router) {
  }

  async ngOnInit(){
    this.btnDisabled = false;
    this.branches = await this.branchService.getAll();
    this.rooms = []
  }

  async onBranchChange(event: Event) {
    let selectedIdBranch = (event.target as HTMLSelectElement).value;
    this.rooms = await this.roomService.getRoomsByIdBranch(selectedIdBranch);
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.machinery.topic = "/"+this.machinery.mserial

    this.statusCode = await this.machineryService.addMachinery(this.machinery);

    if (this.statusCode == 0){
      window.alert("New machinery added!");
      this.router.navigate(['/home/machineries'])
    }

    this.btnDisabled = false;
  }

}
