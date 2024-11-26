import { Component, ContentChild, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent, MenuItem, SortMeta } from 'primeng/api';
import { TableContextMenuSelectEvent } from 'primeng/table';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FilterCriteriaDTO } from '../../model/api/filter-criteria-dto';
import { FilterGroupDTO } from '../../model/api/filter-group-dto';
import { FiltersDTO } from '../../model/api/filters-dto';
import { LogicOperator } from '../../model/api/logic-operator';
import { Pageable } from '../../model/api/pageable';
import { QueryOperation } from '../../model/api/query-operation';
import { Sort } from '../../model/api/sort ';
import { DropdownFilter, HeaderItem } from '../../model/ui/header-item';
import { LazyLoadEmitterEvent } from '../../model/ui/lazy-load-emitter-event';

@Component({
  selector: '[table]',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> {

  protected translate = inject(TranslateService);
  protected layout = inject(LayoutService);

  @Input()
  showToolbar: boolean = true;

  @Input()
  showCurrentPageReport: boolean = true;

  @Input()
  lazy: boolean = true;

  @Input()
  paginator: boolean = true;

  @Input()
  values: T[] = [];

  @Input()
  headers: HeaderItem[] = [];

  @Input()
  page: Pageable = new Pageable(0, 5);

  @Input()
  multiSortMeta?: SortMeta[];

  @Input()
  totalRecords?: number;

  @Input()
  rowsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  @Input()
  globalFieldFilters: string[] = [];

  @Input()
  title: string = '';

  @Input()
  menuItems: MenuItem[] = [
    { label: this.translate.instant('shared.table.actions.empty'), icon: 'pi pi-fw pi-ban' }
  ];

  @ContentChild('tableBody', { read: TemplateRef })
  tableBody?: TemplateRef<any>;

  @Output()
  onLazyLoad: EventEmitter<LazyLoadEmitterEvent> = new EventEmitter<LazyLoadEmitterEvent>();

  @Output()
  onNew: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  onContextMenuSelection: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  selectedItem?: T;

  @Input()
  dataKey: string = 'id';

  @Input()
  highlightRow: boolean = false;

  protected lastLazyLoadEmitterEvent?: LazyLoadEmitterEvent;

  protected loadData(event: LazyLoadEmitterEvent): void { 
    this.lastLazyLoadEmitterEvent = event;
  };
  protected handleNew(): void { };

  protected updateSelectedItem(event: TableContextMenuSelectEvent) {
    if(event)
      this.selectedItem = event?.data;
    this.highlightRow = event !== undefined ? true : false;
  }

  lazyLoad(event: LazyLoadEvent) {
    const lazyLoadEmitterEvent = new LazyLoadEmitterEvent();
    lazyLoadEmitterEvent.originalEvent = event;
    lazyLoadEmitterEvent.filters = this.buildFilters(event);
    lazyLoadEmitterEvent.page = this.buildPage(event);
    this.onLazyLoad.emit(lazyLoadEmitterEvent);
  }

  private buildFilters(event: LazyLoadEvent): FiltersDTO {
    const filtersKeys = Object.keys(event.filters);

    const filters = new FiltersDTO();
    filters.operator = LogicOperator.AND;

    // global filter
    if (filtersKeys.includes('global')) {
      const group = new FilterGroupDTO();
      group.operator = LogicOperator.OR;
      group.groups = [];

      const filterEnable = this.headers.filter(x => x.filter);
      if (filterEnable.length > 0) {
        group.criterias = filterEnable.map(x => {
          const criteria = new FilterCriteriaDTO();
          criteria.field = x.field;
          criteria.operation = QueryOperation.ILIKE;
          criteria.value = event.filters['global'].value;
          return criteria;
        });
        filters.groups = [group];
      }
    }

    // single filter
    const singleFilters = Object.entries(event.filters).filter(([key, value]) => value.value !== null && key !== 'global');
    filters.criterias = singleFilters.map(([key, value]) => {
      const header = this.headers.find(x => x.field === key);
      const criteria = new FilterCriteriaDTO();
      criteria.field = key;

      switch(header.filter.type){
        case "text": {
          switch (value.matchMode) {
            case 'contains':
              criteria.operation = QueryOperation.ILIKE;
              break;
          }
          criteria.value = value.value;
          break;
        }
        case 'dropdown': {
          criteria.operation = QueryOperation.EQUAL;
          criteria.value = value.value;
          break;
        }
        case 'multiselect': {
          break;
        }
        case 'boolean': {
          break;
        }
      }
      
      return criteria;
    });

    const selectableHeader = this.headers.filter(x => x.filter.type === 'dropdown' || x.filter.type === 'multiselect');
    if(selectableHeader.length > 0){
      selectableHeader.forEach(x => {
        if(!filters.criterias.find(f => f.field === x.field)){
          if(x.filter.type === 'dropdown'){
            (x.filter as DropdownFilter).selectedValue = undefined;
          }
        }
      })
    }

    return filters;
  }

  private buildPage(event: LazyLoadEvent): Pageable {
    const page = new Pageable(event.first / event.rows, event.rows, new Sort([]));
    if (event.multiSortMeta) {
      page.sort.sort = event.multiSortMeta.map(x => x.order === 1 ? `${x.field},asc` : `${x.field},desc`);
    }
    return page;
  }
}
