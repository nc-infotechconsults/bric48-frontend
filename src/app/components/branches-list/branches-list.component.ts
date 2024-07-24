import { Component } from '@angular/core';
import { Branch } from '../../models/branch';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-branches-list',
  templateUrl: './branches-list.component.html',
  styleUrl: './branches-list.component.scss'
})
export class BranchesListComponent {

  branches: Branch[] | null = [];
  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private branchService:BranchService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    // ottenimento dei primi itemsPerPage + 1 branch
    this.branches = await this.branchService.getBranchesFromTo(1, this.itemsPerPage + 1);

    // se il numero di branch è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
    // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
    if(this.branches){
      if(this.branches.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.branches.pop();
      }
    }
  }

  // on destroy
  ngOnDestroy() {
  }

  // routing verso la pagina di aggiunta branch
  goToNewBranchPage(): void {
    this.router.navigate(['/home/branches/new']);
  }

  // routing verso la pagina di visualizzazione delle room
  goToRoomsPage(id: any, name: string): void {
    sessionStorage.setItem('idBranch', id)
    sessionStorage.setItem('branchName', name)
    this.router.navigate(['/home/rooms']);
  }

  // eliminazione di un branch
  async deleteBranch(branch: Branch) {

    if (window.confirm('Are you sure you want to delete the branch ' + branch.name + '?')) {

      // elimina il branch se si conferma la scelta
      this.statusCode = await this.branchService.deleteBranch(branch.id);

      if (this.statusCode == 0){

        // aggiorna la pagina
        this.reloadPage()
        window.alert("Branch deleted!");

        // aggiunta log
        this.logService.addLog("Deleted branch "+branch.name)
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }
  

  // routing verso la pagina di modifica del branch
  async editBranch(id: any) {
    sessionStorage.setItem('idBranch', id)
    this.router.navigate(['/home/branches/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // funzione per ottenere gli item per la precedente pagina da visualizzare
  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.branches = await this.branchService.getBranchesFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  // funzione per ottenere gli item per la prossima pagina da visualizzare
  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.branches = await this.branchService.getBranchesFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.branches){
        if(this.branches?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.branches.pop();
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
    if(this.branches){
      const csvData = this.convertToCSV(this.branches);
      this.downloadCSV(csvData, "Branches_List");
      this.logService.addLog("Branches list exported in CSV")
    }
  }

}
