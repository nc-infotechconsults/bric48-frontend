import { Component } from '@angular/core';
import { Machinery } from '../../models/machinery';
import { MachineryService } from '../../services/machinery.service';
import { Router } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { RoomService } from '../../services/room.service';
import { Branch } from '../../models/branch';
import { Room } from '../../models/room';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-machineries-list',
  templateUrl: './machineries-list.component.html',
  styleUrl: './machineries-list.component.scss'
})
export class MachineriesListComponent {

  machineries: Machinery[] | null = [];
  machineriesFiltered: Machinery[] | null = [];
  branches: Branch[] | null = [];
  rooms: Room[] | null = [];

  searchedMserial: string = ""
  searchedName: string = ""
  searchedBranch: string = "all branches"
  searchedRoom: string = "all rooms"

  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private machineryService:MachineryService, private branchService:BranchService, private roomService:RoomService, private logService:LogService, private router: Router) {
  }

  //On init
  async ngOnInit() {

    this.machineries = await this.machineryService.getMachineriesFromTo(1, this.itemsPerPage + 1, this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);

    if(this.machineries){
      if(this.machineries.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.machineries.pop();
      }
    }

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

    if (window.confirm('Are you sure you want to delete the machinery ' + mserial + '?')) {
      this.statusCode = await this.machineryService.deleteMachinery(mserial);

      if (this.statusCode == 0){
        this.reloadPage()
        window.alert("Machinery deleted!");
        this.logService.addLog("Deleted machinery with mserial: "+mserial)
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }
  

  // Edit machinery by maserial
  async editMachinery(mserial: any) {
    sessionStorage.setItem('mserial', mserial)
    this.router.navigate(['/home/machineries/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // Search
  async search() {

    this.currentPage = 1;
    this.totalPages = false;

    this.machineries = await this.machineryService.getMachineriesFromTo(1, this.itemsPerPage + 1, this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);
  
    if(this.machineries != null){
      this.machineries = await Promise.all(this.machineries.map(async (machinery) => {
        let branch = await this.branchService.getById(machinery.idBranch)
        if(branch != null){
          machinery.branchName = branch.name
        }
  
        let room = await this.roomService.getById(machinery.idRoom)
        if(room != null){
          machinery.roomName = room.name
        }
  
        return machinery;
      }));

      if(this.machineries){
        if(this.machineries.length <= this.itemsPerPage){
          this.totalPages = true;
        }else{
          this.machineries.pop();
        }
      }
  

    }
  }

  async onBranchChange(event: Event) {
    this.rooms = await this.roomService.getRoomsByIdBranch(this.searchedBranch);
    this.searchedRoom = "all rooms"
  }


  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.machineries = await this.machineryService.getMachineriesFromTo(startIndex + 1, startIndex + this.itemsPerPage, this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.machineries = await this.machineryService.getMachineriesFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1, this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);

      if(this.machineries){
        if(this.machineries?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.machineries.pop();
        }
      }
    }
  }

  // Funzioni per esportare gli elementi di dataArray in formato CSV
  
  convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }

  downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  }

  async exportToCSV(){
    this.machineriesFiltered = await this.machineryService.getMachineriesFiltered(this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);
    if(this.machineriesFiltered){
      const csvData = this.convertToCSV(this.machineriesFiltered);
      this.downloadCSV(csvData, "Machinery_List");
      this.logService.addLog("Machineries list exported in CSV")
    }
  }

}
