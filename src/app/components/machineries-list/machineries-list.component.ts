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

  // on init
  async ngOnInit() {

    // ottenimento dei primi itemsPerPage + 1 macchinari
    this.machineries = await this.machineryService.getMachineriesFromTo(1, this.itemsPerPage + 1, this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);

    // se il numero di macchinari è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
    // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
    if(this.machineries){
      if(this.machineries.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.machineries.pop();
      }
    }

    if(this.machineries != null){

      // per ogni macchinario
      for (let machinery of this.machineries) {

        // ottenimento del branch del macchinario
        let branch = await this.branchService.getById(machinery.idBranch)
        if(branch != null){
          machinery.branchName = branch.name
        }

        // ottenimento della room del macchinario
        let room = await this.roomService.getById(machinery.idRoom)
        if(room != null){
          machinery.roomName = room.name
        }
        
      }
    }
  }

  // on destroy
  ngOnDestroy() {
  }

  // routing verso la pagina di aggiunta nuovo macchinario
  goToNewMachineryPage(): void {
    this.router.navigate(['/home/machineries/new']);
  }

  // eliminazione del macchinario
  async deleteMachinery(mserial: any) {

    if (window.confirm('Are you sure you want to delete the machinery ' + mserial + '?')) {

      // elimino il macchinario se la scelta è confermata
      this.statusCode = await this.machineryService.deleteMachinery(mserial);

      if (this.statusCode == 0){

        // aggiorno la pagina
        this.reloadPage()

        window.alert("Machinery deleted!");

        // aggiunta del log
        this.logService.addLog("Deleted machinery with mserial: "+mserial)
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }
  

  // modifica del macchinario
  async editMachinery(mserial: any) {
    sessionStorage.setItem('mserial', mserial)

    // routing verso la pagina per la modifica del macchiario
    this.router.navigate(['/home/machineries/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // funzione per la ricerca
  async search() {

    this.currentPage = 1;
    this.totalPages = false;

    // ottenimento dei primi itemsPerPage + 1 macchinari
    this.machineries = await this.machineryService.getMachineriesFromTo(1, this.itemsPerPage + 1, this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);
    
    // riempiamo i campi branchName e roomName di ogni macchinario
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

      // se il numero di macchinari è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
      // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
      if(this.machineries){
        if(this.machineries.length <= this.itemsPerPage){
          this.totalPages = true;
        }else{
          this.machineries.pop();
        }
      }
    }
  }

  // funzione che si esegue quando si seleziona una branch dal menù a tendina
  async onBranchChange(event: Event) {

    // ottenimento delle room del branch selezionato
    this.rooms = await this.roomService.getRoomsByIdBranch(this.searchedBranch);

    // valore di default della tendina
    this.searchedRoom = "all rooms"
  }

  // funzione per ottenere gli item per la precedente pagina da visualizzare
  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.machineries = await this.machineryService.getMachineriesFromTo(startIndex + 1, startIndex + this.itemsPerPage, this.searchedMserial, this.searchedName, this.searchedBranch, this.searchedRoom);
      this.totalPages = false
    }
  }
  
  // funzione per ottenere gli item per la prossima pagina da visualizzare
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

  // funzioni per esportare gli elementi di dataArray in formato CSV
  
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
