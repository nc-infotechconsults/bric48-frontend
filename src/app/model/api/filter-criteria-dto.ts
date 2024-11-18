import { QueryOperation } from "./query-operation";

export interface FilterCriteriaDTO {
  operation?: QueryOperation;
  value?: any;
  field?: string;
}

