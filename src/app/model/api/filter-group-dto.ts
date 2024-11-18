import { FilterCriteriaDTO } from './filter-criteria-dto';
import { LogicOperator } from './logic-operator';

export class FilterGroupDTO { 
    groups?: FilterGroupDTO[];
    criterias?: FilterCriteriaDTO[];
    operator?: LogicOperator;
}
