import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { QueryOperation } from 'src/app/shared/model/api/query-operation';
import { Area } from 'src/app/shared/model/domain/area';
import { Beacon } from 'src/app/shared/model/domain/beacon';
import { Machinery } from 'src/app/shared/model/domain/machinery';
import { Structure } from 'src/app/shared/model/domain/structure';
import { DropdownFilter } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { AreaService } from 'src/app/shared/services/api/area.service';
import { BeaconService } from 'src/app/shared/services/api/beacon.service';
import { MachineryService } from 'src/app/shared/services/api/machinery.service';
import { StructureService } from 'src/app/shared/services/api/structure.service';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrl: './machinery.component.scss'
})
export class MachineryComponent extends TableComponent<Machinery> implements OnInit {

  showDelete = false;
  showDetail = false;

  beacons: Beacon[] = [];
  areas: Area[] = [];
  structures: Structure[] = [];

  private service = inject(MachineryService);
  private areaService = inject(AreaService);
  private beaconService = inject(BeaconService);
  private structureService = inject(StructureService);

  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  fg = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    serial: [null, Validators.required],
    areaId: [null, Validators.required],
    beaconsId: [],
    description: ['']
  });

  override globalFieldFilters: string[] = ['name', 'serial', 'area.name', 'area.structure.name'];
  override menuItems: MenuItem[] = [
    {
      label: this.translate.instant('shared.table.actions.edit'), icon: 'pi pi-fw pi-pencil', command: (e) => {
        this.layout.isLoading.set(true);
        this.fg.reset();
        const beaconFilter = {
          fields: ['id', 'name', 'serial'],
          criterias: [
            { field: 'machinery', value: '', operation: QueryOperation.IS_NULL },
            { field: 'machinery.id', value: this.selectedItem.id, operation: QueryOperation.EQUAL }
          ],
          operator: LogicOperator.OR
        };

        forkJoin({
          machinery: this.service.getById(this.selectedItem.id),
          beacons: this.beaconService.search(beaconFilter, {}, true),
        }).subscribe((v) => {
          this.layout.isLoading.set(false);
          this.beacons = v.beacons.content.map(x => ({ ...x, name: `${x.name} (${x.serial})` }));;
          this.showDetail = true;
          this.fg.patchValue({
            ...v.machinery,
            areaId: v.machinery.area.id,
            beaconsId: v.machinery.beacons.map(x => x.id)
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
    forkJoin({
      areas: this.areaService.search({ fields: ['id', 'name'], operator: LogicOperator.AND }, {}, true),
      structures: this.structureService.search({ fields: ['id', 'name'], operator: LogicOperator.AND }, {}, true),
    }).subscribe((v) => {
      this.areas = v.areas.content;
      this.structures = v.structures.content;
      this.headers = [
        {
          title: 'pages.machinery.table.name', field: 'name', sortable: true, filter: {
            type: 'text', showMenu: false, matchMode: 'contains'
          }
        },
        {
          title: 'pages.machinery.table.serial', field: 'serial', sortable: true, filter: {
            type: 'text', showMenu: false, matchMode: 'contains'
          }
        },
        {
          title: 'pages.machinery.table.areaName', field: 'area.id', sortable: true, filter: {
            type: 'dropdown', showMenu: false, matchMode: 'equals', values: v.areas.content.map(x => ({ value: x.id, label: x.name }))
          } as DropdownFilter
        },
        {
          title: 'pages.machinery.table.structureName', field: 'structure.id', sortable: true, filter: {
            type: 'dropdown', showMenu: false, matchMode: 'equals', values: v.structures.content.map(x => ({ value: x.id, label: x.name }))
          } as DropdownFilter
        }
      ];
      this.layout.isLoading.set(false);
    });
  }

  protected override handleNew(): void {
    this.layout.isLoading.set(true);
    this.selectedItem = null;
    this.fg.reset();
    const beaconFilter = {
      fields: ['id', 'name', 'serial'],
      criterias: [
        { field: 'machinery', value: '', operation: QueryOperation.IS_NULL }
      ],
      operator: LogicOperator.AND
    };
    this.beaconService.search(beaconFilter, {}, true).subscribe((v) => {
      this.beacons = v.content.map(x => ({ ...x, name: `${x.name} (${x.serial})` }));
      this.layout.isLoading.set(false);
      this.showDetail = true;
    });
  }

  protected override loadData(event: LazyLoadEmitterEvent): void {
    super.loadData(event);
    this.layout.isLoading.set(true);

    forkJoin({
      machineries: this.service.search(event.filters, event.page)
    }).subscribe((v) => {
      console.log(v);
      this.values = v.machineries.content;
      this.totalRecords = v.machineries.page.totalElements;
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
