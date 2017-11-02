import { FindingsQuickFilterModel } from '../../../models/manager-view/finding-overview/common/findings/findings-quick-filter.model';
import { NodeType } from '../../../models/manager-view/common/model/node-type';
import { Surface } from '../../../models/manager-view/common/model/surface';
import { SummaryViewItemFilter } from './summary-view-item-filter.model';

export class SummaryViewFilterModel {
  nodeId: string;
  type: NodeType;
  surface: Surface;
  quickFilters: FindingsQuickFilterModel;
  summaryViewFilter: SummaryViewItemFilter[];
}