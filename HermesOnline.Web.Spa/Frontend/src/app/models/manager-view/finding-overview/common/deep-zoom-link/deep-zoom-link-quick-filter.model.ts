export class DeepZoomLinkQuickFilterModel {
    constructor(
        public siteIds = new Array<string>(),
        public turbineIds = new Array<string>(),
        public turbineSerials = new Array<string>(),
        public bladeIds = new Array<string>(),
        public surfaces = new Array<number>(),
        public dates = new Array<string>(),
        public photoSources = new Array<number>(),
        public inspections = new Array<string>(),
        public countries = new Array<number>(),
        public regions = new Array<string>()
    ) { }
}
