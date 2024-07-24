import { Component } from '@angular/core';
import { Message } from '../../models/message';
import { MessageService } from '../../services/message.service';
import { LogService } from '../../services/log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.scss'
})
export class MessagesListComponent {

  messages: Message[] | null = [];
  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private messageService:MessageService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() { 

    // ottenimento dei primi itemsPerPage + 1 messaggi
    this.messages = await this.messageService.getMessagesFromTo(1, this.itemsPerPage + 1);

    // se il numero di messaggi è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
    // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
    if(this.messages){
      if(this.messages.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.messages.pop();
      }
    }
  }

  // on destroy
  ngOnDestroy() {
  }

  // funzione per l'eliminazione di un messaggio
  async deleteMessage(id: string) {

    if (window.confirm('Are you sure you want to delete this message?')) {

      // eliminazione del messaggio se è stata confermata la scelta
      this.statusCode = await this.messageService.deleteMessage(id);

      if (this.statusCode == 0){

        window.alert("Message deleted!");

        // aggiunta del log
        this.logService.addLog("Message deleted")

        // aggiorno la pagina
        this.reloadPage()

      }else{
        window.alert("Error with status code: " + this.statusCode)
      }

    }
    
  }

  // routing verso la pagina di creazione di un nuovo messaggio
  goToNewMessagePage(){
    this.router.navigate(['/home/messages/new']);
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
      this.messages = await this.messageService.getMessagesFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }
  
  // funzione per ottenere gli item per la prossima pagina da visualizzare
  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.messages = await this.messageService.getMessagesFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.messages){
        if(this.messages?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.messages.pop();
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
    if(this.messages){
      const csvData = this.convertToCSV(this.messages);
      this.downloadCSV(csvData, "Messages_List");
      this.logService.addLog("Messages list exported in CSV")
    }
  }

}
