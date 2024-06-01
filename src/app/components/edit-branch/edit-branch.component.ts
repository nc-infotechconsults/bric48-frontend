import { Component } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrl: './edit-branch.component.scss'
})
export class EditBranchComponent {

  branch:any = {} as any;

  idBranch: any = sessionStorage.getItem('idBranch');

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor( private branchService:BranchService, private router: Router) {
  }

   //On init
   async ngOnInit() {
    this.btnDisabled = false;
    this.branch = await this.branchService.getById(this.idBranch);
  }


  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.statusCode = await this.branchService.editBranch(this.branch);

    if (this.statusCode == 0){
      window.alert("Branch edited!");
      this.router.navigate(['/home/branches'])
    }

    this.btnDisabled = false;
  }

}
