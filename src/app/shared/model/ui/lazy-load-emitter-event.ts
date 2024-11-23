import { LazyLoadEvent } from "primeng/api";
import { FiltersDTO } from "../api/filters-dto";
import { Pageable } from "../api/pageable";

export class LazyLoadEmitterEvent {
    page?: Pageable;
    filters?: FiltersDTO;
    originalEvent?: LazyLoadEvent;
}