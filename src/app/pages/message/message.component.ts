import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService as ToastService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { QueryOperation } from 'src/app/shared/model/api/query-operation';
import { DefaultMessage } from 'src/app/shared/model/domain/default-message';
import { Message } from 'src/app/shared/model/domain/message';
import { User } from 'src/app/shared/model/domain/user';
import { Roles } from 'src/app/shared/model/enums/role';
import { DropdownFilter } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { DefaultMessageService } from 'src/app/shared/services/api/default-message.service';
import { MessageService } from 'src/app/shared/services/api/message.service';
import { UserService } from 'src/app/shared/services/api/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent extends TableComponent<Message> implements OnInit {

  showDetail = false;

  defaultMessages: DefaultMessage[] = [];
  receivers: User[] = [];

  private service = inject(MessageService);
  private defaultMessageService = inject(DefaultMessageService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private messageService = inject(ToastService);

  fg = this.fb.group({
    defaultMessageId: [null, Validators.required],
    receiversId: [null, Validators.required]
  });

  override globalFieldFilters: string[] = ['receiver.name', 'receiver.surname', 'sender.name', 'sender.surname', 'message'];

  ngOnInit(): void {
    this.layout.isLoading.set(true);
    const receiverFilter = {
      criterias: [
        { field: 'role.id', value: Roles.WORKER, operation: QueryOperation.EQUAL },
      ],
      operator: LogicOperator.AND
    };

    const senderFilter = {
      criterias: [
        { field: 'role.id', value: Roles.SECURITY_MANAGER, operation: QueryOperation.EQUAL },
        { field: 'role.id', value: Roles.ADMINISTRATOR, operation: QueryOperation.EQUAL },
      ],
      operator: LogicOperator.OR
    };

    forkJoin({
      receivers: this.userService.search(receiverFilter, {}, true),
      senders: this.userService.search(senderFilter, {}, true)
    }).subscribe({
      next: (v) => {
        this.receivers = v.receivers.content.map(x => ({...x, label: x.name + " " + x.surname}));
        this.headers = [
          {
            title: 'pages.message.table.sentAt', field: 'sentAt', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          },
          {
            title: 'pages.message.table.receiver', field: 'receiver.id', sortable: true, filter: {
              type: 'dropdown', showMenu: false, matchMode: 'equals', values: v.receivers.content.map(x => ({ value: x.id, label: x.name + " " + x.surname }))
            } as DropdownFilter
          },
          {
            title: 'pages.message.table.sender', field: 'sender.id', sortable: true, filter: {
              type: 'dropdown', showMenu: false, matchMode: 'equals', values: v.senders.content.map(x => ({ value: x.id, label: x.name + " " + x.surname }))
            } as DropdownFilter
          },
          {
            title: 'pages.message.table.message', field: 'message', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          }
        ];
        this.layout.isLoading.set(false);
      }
    })
  }

  protected override handleNew(): void {
    this.selectedItem = null;
    this.fg.reset();
    this.showDetail = true;
  }

  protected override loadData(event: LazyLoadEmitterEvent): void {
    super.loadData(event);
    this.layout.isLoading.set(true);

    forkJoin({
      messages: this.service.search(event.filters, event.page),
      defaultMessages: this.defaultMessageService.search({ operator: LogicOperator.AND }, {}, true)
    }).subscribe({
      next: (v) => {
        this.values = v.messages.content;
        this.totalRecords = v.messages.page.totalElements;
        this.defaultMessages = v.defaultMessages.content;
        event.originalEvent.forceUpdate();
        this.layout.isLoading.set(false);
      }
    })
  }

  handleSave(): void {
    this.layout.isLoading.set(true);

    const receiversId = this.fg.value.receiversId as string[];
    const defaultMessage = this.defaultMessages.find(x => x.id === this.fg.value.defaultMessageId);
    const requests = {};

    receiversId.forEach(id => {
      const user = this.receivers.find(x => x.id === id);
      let transMsg = defaultMessage.translations.find(x => x.language === user.language);
      if(!transMsg){
        transMsg = defaultMessage.translations.find(x => x.isDefault);
      }
      const dto = { language: transMsg.language, message: transMsg.message, receiverId: id };
      requests[id] = this.service.save(dto);
    });

    forkJoin(requests).subscribe({
      next: (v) => {
        this.layout.isLoading.set(false);
        this.showDetail = false;
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('shared.messages.createSuccess.summary'),
          detail: this.translate.instant('shared.messages.createSuccess.detail'),
        });
        this.loadData(this.lastLazyLoadEmitterEvent);
      }
    });
  }

}
