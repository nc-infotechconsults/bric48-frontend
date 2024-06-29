import { Component } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { LogService } from '../../services/log.service';
import { Router } from '@angular/router';
import { Message } from '../../models/message';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {

  message:Message = {} as Message;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private messageService:MessageService, private logService:LogService, private router: Router) {
  }

  ngOnInit(){
    this.btnDisabled = false;
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.statusCode = await this.messageService.addMessage(this.message);

    if (this.statusCode == 0){
      window.alert("New message added!");
      this.logService.addLog("Added new message")
      this.router.navigate(['/home/messages'])
    }

    this.btnDisabled = false;
  }

}
