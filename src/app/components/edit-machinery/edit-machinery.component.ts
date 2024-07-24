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
  
  // mserial del macchinario che vogliamo modificare
  mserial: any = sessionStorage.getItem('mserial');

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private machineryService:MachineryService, private branchService:BranchService, private roomService:RoomService, private logService:LogService, private router: Router) {
  }

   // on init
   async ngOnInit() {
    this.btnDisabled = false;

    // ottenimento del macchinario da modificare
    this.machinery = await this.machineryService.getMachineryByMserial(this.mserial);

    // ottenimento di tutte le branch
    this.branches = await this.branchService.getAll();

    // ottenimento delle room appartenenti al branch del macchinario
    this.rooms = await this.roomService.getRoomsByIdBranch(this.machinery.idBranch);
  }

  // funzione che si esegue quando si seleziona un branch dal menù a tendina
  async onBranchChange(event: Event) {
    let selectedIdBranch = (event.target as HTMLSelectElement).value;

    // ottenimento delle room appartenenti al branch selezionato
    this.rooms = await this.roomService.getRoomsByIdBranch(selectedIdBranch);
  }
  
  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;
    
    // creazione automatica del topic da associare al macchinario
    this.machinery.topic = '/'+this.machinery.mserial

    // modifica del macchinario
    this.statusCode = await this.machineryService.editMachinery(this.machinery);

    if (this.statusCode == 0){
      window.alert("Machinery edited!");

      // aggiunta del log
      this.logService.addLog("Edited machinery with mserial: "+this.machinery.mserial)

      // routing verso la pagina di visualizzazione dei macchinari
      this.router.navigate(['/home/machineries'])
    }

    this.btnDisabled = false;
  }


}
