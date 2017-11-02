
import { FindingsQuickFilterModel } from '../common/findings/findings-quick-filter.model';
import { NodeType } from '../../common/model/node-type';
import { SummaryViewItemFilter } from '../../summary-view/summary-view-item-filter.model';

export class GenerateDataExtractModel {
    public TaskId: string;
    public generateImages = false;
    public nodeType: NodeType;
    public nodeId: string;
    public quickFilters: FindingsQuickFilterModel;
    public summaryViewFilter: SummaryViewItemFilter[];
    public timeLineFilter?: Array<string>;
}
