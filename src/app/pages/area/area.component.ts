import { Component, inject } from '@angular/core';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { Area } from 'src/app/shared/model/domain/area';
import { HeaderItem } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { AreaService } from 'src/app/shared/services/api/area.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent extends TableComponent<Area> {

  private areaService = inject(AreaService);

  override globalFieldFilters: string[] = ['name', 'structure.name'];
  override headers: HeaderItem[] = [
    {
      title: 'pages.area.table.name', field: 'name', sortable: true, filter: {
        type: 'text', showMenu: false, matchMode: 'contains'
      }
    },
    {
      title: 'pages.area.table.structureName', field: 'structure.name', sortable: true, filter: {
        type: 'text', showMenu: false, matchMode: 'contains'
      }
    }
  ];

  protected override loadData(event: LazyLoadEmitterEvent): void {
      event.filters.fields = ['name', 'structure.name', 'structure.id'];
      this.areaService.search(event.filters, event.page).subscribe({
        next: (v) => {
          console.log(v);
          this.values = v.content;
          this.totalRecords = v.page.totalElements;
          event.originalEvent.forceUpdate();
        }
      })
  }
}
