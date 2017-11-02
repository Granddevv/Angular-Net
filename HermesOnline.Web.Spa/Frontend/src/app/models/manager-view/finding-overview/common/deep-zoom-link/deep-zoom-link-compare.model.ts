
import { NodeType } from "../../../common/model/node-type";

export class DeepZoomLinkCompareDialogModel {
    constructor(
        public excludeDeepZoomLinkId: string,
        public nodeType: NodeType,
        public nodeId: string
    ) { }
}

