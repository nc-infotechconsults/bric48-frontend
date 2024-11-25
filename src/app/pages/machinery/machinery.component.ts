import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { Machinery } from 'src/app/shared/model/domain/machinery';
import { HeaderItem } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { MachineryService } from 'src/app/shared/services/api/machinery.service';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrl: './machinery.component.scss'
})
export class MachineryComponent extends TableComponent<Machinery> {

  showDelete = false;
  showDetail = false;

  private service = inject(MachineryService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  fg = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    description: ['']
  });

  override globalFieldFilters: string[] = ['name'];
  override headers: HeaderItem[] = [
    {
      title: 'pages.structure.table.name', field: 'name', sortable: true, filter: {
        type: 'text', showMenu: false, matchMode: 'contains'
      }
    },
    {
      title: 'pages.structure.table.description', field: 'description', sortable: true, filter: {
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
    }else{
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
