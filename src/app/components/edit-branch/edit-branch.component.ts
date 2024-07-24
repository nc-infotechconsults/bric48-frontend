import { Component } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrl: './edit-branch.component.scss'
})
export class EditBranchComponent {

  branch:any = {} as any;

  // id del branch che vogliamo modificare
  idBranch: any = sessionStorage.getItem('idBranch');

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor( private branchService:BranchService, private logService:LogService, private router: Router) {
  }

   // on init
   async ngOnInit() {
    this.btnDisabled = false;

    // ottenimento del branch
    this.branch = await this.branchService.getById(this.idBranch);
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    // modifca del branch
    this.statusCode = await this.branchService.editBranch(this.branch);

    if (this.statusCode == 0){
      window.alert("Branch edited!");

      // aggiunta del log
      this.logService.addLog("Edited branch "+this.branch.name)

      // routing verso la pagina di visualizzazione dei branch
      this.router.navigate(['/home/branches'])
    }

    this.btnDisabled = false;
  }

}
