import { Component } from '@angular/core';
import { Machinery } from '../../models/machinery';
import { MachineryService } from '../../services/machinery.service';
import { Router } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { RoomService } from '../../services/room.service';
import { Branch } from '../../models/branch';
import { Room } from '../../models/room';

@Component({
  selector: 'app-machineries-list',
  templateUrl: './machineries-list.component.html',
  styleUrl: './machineries-list.component.scss'
})
export class MachineriesListComponent {

  machineries: Machinery[] | null = [];
  branches: Branch[] | null = [];
  rooms: Room[] | null = [];

  searchedMserial: string = ""
  searchedName: string = ""
  searchedBranch: string = ""
  searchedRoom: string = ""

  statusCode: number = 0;

  constructor(private machineryService:MachineryService, private branchService:BranchService, private roomService:RoomService, private router: Router) {
  }

  //On init
  async ngOnInit() {

    this.machineries = await this.machineryService.getAll();
    this.branches = await this.branchService.getAll();

    if(this.machineries != null){
      for (let machinery of this.machineries) {

        let branch = await this.branchService.getById(machinery.idBranch)
        if(branch != null){
          machinery.branchName = branch.name
        }

        let room = await this.roomService.getById(machinery.idRoom)
        if(room != null){
          machinery.roomName = room.name
        }

        if(this.searchedMserial != ""){
          console.log("entrato")
          this.machineries = this.machineries.filter(machinery => machinery.mserial === this.searchedMserial);
        }
        
      }
    }
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewMachineryPage(): void {
    this.router.navigate(['/home/machineries/new']);
  }

  // Delete machinery by mserial
  async deleteMachinery(mserial: any) {
    this.statusCode = await this.machineryService.deleteMachinery(mserial);

    if (this.statusCode == 0){
      this.reloadPage()
      window.alert("Machinery deleted!");
    }else{
      window.alert("Error with status code: " + this.statusCode)
    }
  }
  

  // Edit machinery by maserial
  async editMachinery(mserial: any) {
    localStorage.setItem('mserial', mserial)
    this.router.navigate(['/home/machineries/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // Search
  search() {
    this.reloadPage()
  }

  async onBranchChange(event: Event) {
    this.rooms = await this.roomService.getRoomsByIdBranch(this.searchedBranch);
  }

}
