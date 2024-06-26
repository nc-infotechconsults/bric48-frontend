import { Component } from '@angular/core';
import { Branch } from '../../models/branch';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-new-branch',
  templateUrl: './new-branch.component.html',
  styleUrl: './new-branch.component.scss'
})
export class NewBranchComponent {

  branch:Branch = {} as Branch;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor( private branchService:BranchService, private logService:LogService, private router: Router) {
  }

  async ngOnInit(){
    this.btnDisabled = false;
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.statusCode = await this.branchService.addBranch(this.branch);

    if (this.statusCode == 0){
      window.alert("New branch added!");
      this.logService.addLog("Added branch "+this.branch.name)
      this.router.navigate(['/home/branches'])
    }

    this.btnDisabled = false;
  }

}
