import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { forkJoin, Subscription } from 'rxjs';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { QueryOperation } from 'src/app/shared/model/api/query-operation';
import { Headphone } from 'src/app/shared/model/domain/headphone';
import { Machinery } from 'src/app/shared/model/domain/machinery';
import { Role } from 'src/app/shared/model/domain/role';
import { User } from 'src/app/shared/model/domain/user';
import Languages from 'src/app/shared/model/enums/language';
import { Roles } from 'src/app/shared/model/enums/role';
import { DropdownFilter } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { HeadphoneService } from 'src/app/shared/services/api/headphone.service';
import { MachineryService } from 'src/app/shared/services/api/machinery.service';
import { RoleService } from 'src/app/shared/services/api/role.service';
import { UserService } from 'src/app/shared/services/api/user.service';

export function passwordConfirmationValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(controlName);
    const confirmPasswordControl = formGroup.get(matchingControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== null && passwordControl.value !== '' && passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, passwordMismatch: true });
    } else {
      if(confirmPasswordControl.errors && confirmPasswordControl.errors['passwordMismatch'])
        delete confirmPasswordControl.errors['passwordMismatch'];

      confirmPasswordControl.setErrors(confirmPasswordControl.errors && Object.keys(confirmPasswordControl.errors).length > 0 ? { ...confirmPasswordControl.errors } : null);
    }

    return null;
  };
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent extends TableComponent<User> implements OnInit {

  readonly Roles = Roles;
  readonly languages = Languages;

  showDelete = false;
  showDetail = false;

  roles: Role[] = [];
  headphones: Headphone[] = [];
  machineries: Machinery[] = [];

  private passwordChange?: Subscription; 

  private service = inject(UserService);
  private machineryService = inject(MachineryService);
  private headphoneService = inject(HeadphoneService);
  private roleService = inject(RoleService);

  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  fg = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    regNumber: [''],
    language: [''],
    phoneNumber: [''],
    password: [''],
    confirmPassword: [''],
    roleId: ['', Validators.required],
    headphoneId: [''],
    machineriesId: [[] as string[]]
  }, {
    validators: passwordConfirmationValidator("password", "confirmPassword")
  });

  override globalFieldFilters: string[] = ['name', 'surname', 'email'];
  override menuItems: MenuItem[] = [
    {
      label: this.translate.instant('shared.table.actions.edit'), icon: 'pi pi-fw pi-pencil', command: (e) => {
        this.layout.isLoading.set(true);
        this.fg.reset();
        const headphoneFilter = {
          fields: ['id', 'name', 'serial'],
          criterias: [
            { field: 'user', value: '', operation: QueryOperation.IS_NULL },
            { field: 'user.id', value: this.selectedItem.id, operation: QueryOperation.EQUAL }
          ],
          operator: LogicOperator.OR
        };

        this.fg.get('password').removeValidators([Validators.required, Validators.minLength(8)]);
        this.fg.get('password').updateValueAndValidity();
        this.fg.get('confirmPassword').removeValidators(Validators.required);
        this.fg.get('confirmPassword').updateValueAndValidity();

        if(this.passwordChange)
          this.passwordChange.unsubscribe();

        this.passwordChange = this.fg.get('password').valueChanges.subscribe(v => {
          if(v){
            if(!this.fg.hasValidator(Validators.minLength(8)))
              this.fg.get('password').addValidators(Validators.minLength(8));
          }else{
            this.fg.get('password').removeValidators(Validators.minLength(8));
          }
        });

        forkJoin({
          user: this.service.getById(this.selectedItem.id),
          headphones: this.headphoneService.search(headphoneFilter, {}, true),
        }).subscribe((v) => {
          this.layout.isLoading.set(false);
          this.headphones = v.headphones.content.map(x => ({ ...x, name: `${x.name} (${x.serial})` }));;
          this.showDetail = true;
          this.fg.patchValue({
            ...v.user,
            roleId: v.user.role?.id,
            headphoneId: v.user.headphone?.id,
            machineriesId: v.user.machineries?.map(x => x.id)
          });
        });
      }
    },
    {
      label: this.translate.instant('shared.table.actions.delete'), styleClass: 'menu-item-danger', icon: 'pi pi-fw pi-trash', command: (e) => {
        this.showDelete = true;
      }
    }
  ];

  ngOnInit(): void {
    this.layout.isLoading.set(true);
    this.roleService.search({ operator: LogicOperator.AND }, {}, true).subscribe((v) => {
      this.roles = v.content;
      this.headers = [
        {
          title: 'pages.user.table.name', field: 'name', sortable: true, filter: {
            type: 'text', showMenu: false, matchMode: 'contains'
          }
        },
        {
          title: 'pages.user.table.surname', field: 'serial', sortable: true, filter: {
            type: 'text', showMenu: false, matchMode: 'contains'
          }
        },
        {
          title: 'pages.user.table.email', field: 'serial', sortable: true, filter: {
            type: 'text', showMenu: false, matchMode: 'contains'
          }
        },
        {
          title: 'pages.user.table.roleName', field: 'role.id', sortable: true, filter: {
            type: 'dropdown', showMenu: false, matchMode: 'equals', values: v.content.map(x => ({ value: x.id, label: x.name }))
          } as DropdownFilter
        }
      ];
      this.layout.isLoading.set(false);
    });

    this.fg.get('roleId').valueChanges.subscribe(v => {
      if(v === Roles.WORKER){
        this.fg.get('language').addValidators(Validators.required);
      }else{
        this.fg.get('language').clearValidators();
      }
      this.fg.get('language').updateValueAndValidity();
    });
  }

  protected override handleNew(): void {
    this.layout.isLoading.set(true);
    this.selectedItem = null;
    this.fg.reset();
    const headphoneFilter = {
      fields: ['id', 'name', 'serial'],
      criterias: [
        { field: 'user', value: '', operation: QueryOperation.IS_NULL }
      ],
      operator: LogicOperator.AND
    };

    this.fg.get('password').setValidators([Validators.required, Validators.minLength(8)]);
    this.fg.get('password').updateValueAndValidity();
    this.fg.get('confirmPassword').setValidators(Validators.required);
    this.fg.get('confirmPassword').updateValueAndValidity();

    if(this.passwordChange)
      this.passwordChange.unsubscribe();

    this.headphoneService.search(headphoneFilter, {}, true).subscribe((v) => {
      this.headphones = v.content.map(x => ({ ...x, name: `${x.name} (${x.serial})` }));
      this.layout.isLoading.set(false);
      this.showDetail = true;
    });
  }

  protected override loadData(event: LazyLoadEmitterEvent): void {
    super.loadData(event);
    this.layout.isLoading.set(true);

    forkJoin({
      users: this.service.search(event.filters, event.page),
      machineries: this.machineryService.search({ operator: LogicOperator.AND }, {}, true)
    }).subscribe((v) => {
      console.log(v);
      this.values = v.users.content;
      this.machineries = v.machineries.content;
      this.totalRecords = v.users.page.totalElements;
      event.originalEvent.forceUpdate();
      this.layout.isLoading.set(false);
    });
  }

  handleSave(): void {
    this.layout.isLoading.set(true);
    const dto = this.fg.value;
    if (dto.id !== null) {
      this.service.update(dto.id, dto).subscribe({
        next: (v) => {
          this.layout.isLoading.set(false);
          this.showDetail = false;
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('shared.messages.updateSuccess.summary'),
            detail: this.translate.instant('shared.messages.updateSuccess.detail'),
          });
          this.loadData(this.lastLazyLoadEmitterEvent);
        }
      });
    } else {
      this.service.save(dto).subscribe({
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

  handleDelete(): void {
    this.layout.isLoading.set(true);
    this.service.delete(this.selectedItem.id).subscribe({
      next: (v) => {
        this.layout.isLoading.set(false);
        this.showDelete = false;
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('shared.messages.deleteSuccess.summary'),
          detail: this.translate.instant('shared.messages.deleteSuccess.detail'),
        });
        this.loadData(this.lastLazyLoadEmitterEvent);
      }
    });
  }

}
