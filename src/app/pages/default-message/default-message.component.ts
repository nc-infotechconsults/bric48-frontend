import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { DefaultMessage } from 'src/app/shared/model/domain/default-message';
import { DefaultTranslationMessage } from 'src/app/shared/model/domain/default-translation-message';
import Languages from 'src/app/shared/model/enums/language';
import { HeaderItem } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { DefaultMessageService } from 'src/app/shared/services/api/default-message.service';

@Component({
  selector: 'app-default-message',
  templateUrl: './default-message.component.html',
  styleUrl: './default-message.component.scss'
})
export class DefaultMessageComponent extends TableComponent<DefaultMessage> {

  showDelete = false;
  showDetail = false;

  languages = Languages;

  visible = false;


  private service = inject(DefaultMessageService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  fg = this.fb.group({
    id: [null],
    title: [null, Validators.required],
    translations: [[] as DefaultTranslationMessage[], Validators.required],
  });

  fgTranslation = this.fb.group({
    language: [null, Validators.required],
    isDefault: [false],
    message: [null, Validators.required],
  });

  override globalFieldFilters: string[] = ['message'];
  override headers: HeaderItem[] = [
    {
      title: 'pages.defaultMessage.table.title', field: 'title', sortable: true, filter: {
        type: 'text', showMenu: false, matchMode: 'contains'
      }
    },
    {
      title: 'pages.defaultMessage.table.message', field: 'message', sortable: true, filter: {
        type: 'text', showMenu: false, matchMode: 'contains'
      }
    }
  ];

  override menuItems: MenuItem[] = [
    {
      label: this.translate.instant('shared.table.actions.edit'), icon: 'pi pi-fw pi-pencil', command: (e) => {
        this.layout.isLoading.set(true);
        this.fg.reset();
        this.service.getById(this.selectedItem.id).subscribe({
          next: (v) => {
            this.layout.isLoading.set(false);
            this.showDetail = true;
            this.fg.patchValue(v);
          }
        });
      }
    },
    {
      label: this.translate.instant('shared.table.actions.delete'), styleClass: 'menu-item-danger', icon: 'pi pi-fw pi-trash', command: (e) => {
        this.showDelete = true;
      }
    }
  ];

  protected override handleNew(): void {
    this.selectedItem = null;
    this.fg.reset();
    this.showDetail = true;
  }

  protected override loadData(event: LazyLoadEmitterEvent): void {
    super.loadData(event);
    this.layout.isLoading.set(true);
    this.service.search(event.filters, event.page).subscribe({
      next: (v) => {
        console.log(v);
        this.values = v.content;
        this.totalRecords = v.page.totalElements;
        event.originalEvent.forceUpdate();
        this.layout.isLoading.set(false);
      }
    })
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

  get translations() {
    const v = this.fg.get('translations').value;
    return v ? v : [];
  }

  getLanguage(lang: string) {
    return Languages.find(x => x.id === lang)?.label ?? '';
  }

  removeItem(lang: string) {
    let translations = this.translations.filter(x => x.language !== lang);
    this.fg.get('translations').setValue(translations);
  }

  openTranslationDialog() {
    this.fgTranslation.reset();
    const translationsIds = this.translations.map(x => x.language);
    this.languages = Languages.filter(x => !translationsIds.includes(x.id));

    if(this.translations.find(x => x.isDefault)){
      this.fgTranslation.get('isDefault').disable();
    }else{
      this.fgTranslation.get('isDefault').enable();
    }

    this.visible = true;
  }

  addTranslation() {
    let translations = this.translations;
    translations.push(this.fgTranslation.value as DefaultTranslationMessage);
    this.fg.get('translations').setValue(translations);

    this.fgTranslation.reset();

    this.visible = false;
  }

}
