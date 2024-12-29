import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { Role } from 'src/app/shared/model/domain/role';
import { Roles } from 'src/app/shared/model/enums/role';
import { RoleService } from 'src/app/shared/services/api/role.service';
import { UserService } from 'src/app/shared/services/api/user.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';

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
      if (confirmPasswordControl.errors && confirmPasswordControl.errors['passwordMismatch'])
        delete confirmPasswordControl.errors['passwordMismatch'];

      confirmPasswordControl.setErrors(confirmPasswordControl.errors && Object.keys(confirmPasswordControl.errors).length > 0 ? { ...confirmPasswordControl.errors } : null);
    }

    return null;
  };
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  readonly Roles = Roles;

  roles: Role[] = [];

  private service = inject(UserService);
  private roleService = inject(RoleService);
  private layout = inject(LayoutService);
  private appConfigService = inject(AppConfigService);

  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  fg = this.fb.group({
    id: [{ value: '', disabled: true }],
    name: [{ value: '', disabled: true }],
    surname: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }],
    regNumber: [{ value: '', disabled: true }],
    phoneNumber: [{ value: '', disabled: true }],
    password: [''],
    confirmPassword: [''],
    roleId: [{ value: '', disabled: true }]
  }, {
    validators: passwordConfirmationValidator("password", "confirmPassword")
  });

  ngOnInit(): void {
    this.layout.isLoading.set(true);
    this.roleService.search({ operator: LogicOperator.AND }, {}, true).subscribe((v) => {
      this.roles = v.content;
      const user = this.appConfigService.loggedUser();
      this.fg.patchValue({ ...user, roleId: user.role.id });

      this.fg.get('password').valueChanges.subscribe(v => {
        if (v) {
          if (!this.fg.hasValidator(Validators.minLength(8)))
            this.fg.get('password').addValidators(Validators.minLength(8));
        } else {
          this.fg.get('password').removeValidators(Validators.minLength(8));
        }
      });

      this.layout.isLoading.set(false);
    });
  }

  updatePassword() {
    this.layout.isLoading.set(true);
    const dto = this.fg.getRawValue();
    this.service.patch(dto.id, { password: dto.password }).subscribe({
      next: (v) => {
        this.layout.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('shared.messages.updateSuccess.summary'),
          detail: this.translate.instant('shared.messages.updateSuccess.detail'),
        });
      }
    });
  }

}
