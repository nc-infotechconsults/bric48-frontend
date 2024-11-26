export type FilterType = 'text' | 'boolean' | 'dropdown' | 'multiselect' | 'none'

export class HeaderFilter {
    type?: FilterType = 'none';
    matchMode?: string = 'contains';
    showMenu?: boolean = false;
    ariaLabel?: string = '';
    placeholder?: string = '';
}

export class DropdownFilter extends HeaderFilter {
    values: { value: string, label: string}[];
    selectedValue: string;
}

export class HeaderItem {
    title?: string;
    field?: string;
    sortable?: boolean;
    filter?: HeaderFilter;
}