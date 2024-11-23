import { QueryOperation } from "./query-operation";

export class FilterCriteriaDTO {
  operation?: QueryOperation;
  value?: any;
  field?: string;
}

