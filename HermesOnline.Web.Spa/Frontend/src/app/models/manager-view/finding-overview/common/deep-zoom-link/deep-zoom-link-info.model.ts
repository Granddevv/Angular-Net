
import { AnnotationsDto } from '../../../common/model/defect-annotation';
import { Surface } from "../../../common/model/surface";

export class DeepZoomLinkInfo {
    constructor(
        public tileSize: string,
        public overlap: string,
        public width: string,
        public height: string,
        public deepZoomLinkId: string,
        public inspectionId: string,
        public bladeId: string,
        public surface: Surface,
        public annotations: AnnotationsDto[]
    ) { }
}
