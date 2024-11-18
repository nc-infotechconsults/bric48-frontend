import { FilterCriteriaDTO } from './filter-criteria-dto';
import { FilterGroupDTO } from './filter-group-dto';
import { LogicOperator } from './logic-operator';

export class FiltersDTO { 
    fields?: string[];
    groups?: FilterGroupDTO[];
    criterias?: FilterCriteriaDTO[];
    operator?: LogicOperator;
}
