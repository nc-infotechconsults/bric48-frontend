import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { Area } from 'src/app/shared/model/domain/area';
import { Structure } from 'src/app/shared/model/domain/structure';
import { DropdownFilter } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { AreaService } from 'src/app/shared/services/api/area.service';
import { StructureService } from 'src/app/shared/services/api/structure.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent extends TableComponent<Area> implements OnInit {

  showDelete = false;
  showDetail = false;

  structures: Structure[] = [];

  private service = inject(AreaService);
  private structureService = inject(StructureService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  fg = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    description: [''],
    structureId: ['', Validators.required]
  });

  override globalFieldFilters: string[] = ['name', 'structure.name'];

  override menuItems: MenuItem[] = [
    {
      label: this.translate.instant('shared.table.actions.edit'), icon: 'pi pi-fw pi-pencil', command: (e) => {
        this.layout.isLoading.set(true);
        this.fg.reset();
        this.service.getById(this.selectedItem.id).subscribe({
          next: (v) => {
            this.layout.isLoading.set(false);
            this.showDetail = true;
            this.fg.patchValue({
              ...v,
              structureId: v.structure.id
            });
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

  ngOnInit(): void {
    this.layout.isLoading.set(true);
    this.structureService.search({ operator: LogicOperator.AND }, {}, true).subscribe({
      next: (v) => {
        this.structures = v.content;
        this.headers = [
          {
            title: 'pages.area.table.name', field: 'name', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          },
          {
            title: 'pages.area.table.description', field: 'description', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          },
          {
            title: 'pages.area.table.structureName', field: 'structure.id', sortable: true, filter: {
              type: 'dropdown', showMenu: false, matchMode: 'equals', values: v.content.map(x => ({ value: x.id, label: x.name }))
            } as DropdownFilter
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
    console.log(event);
    super.loadData(event);
    this.layout.isLoading.set(true);
    this.service.search(event.filters, event.page).subscribe({
      next: (v) => {
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

}
