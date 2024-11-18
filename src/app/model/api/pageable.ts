import { Sort } from "./sort ";

export interface Pageable {
    page?: number;
    size?: number;
    sort?: Sort;
}
