export class FindingsQuickFilterModel {
    constructor(
        public severities = new Array<number>(),
        public categories = new Array<string>(),
        public layers = new Array<number>(),
        public siteIds = new Array<string>(),
        public bladeIds = new Array<string>(),
        public turbineIds = new Array<string>(),
        public turbineTypes = new Array<string>(),
        public platforms = new Array<string>(),
        public surfaces = new Array<number>(),
        public inspectionDates = new Array<string>(),
        public inspectionTypes = new Array<string>(),
        public inspectionCompanies = new Array<string>(),
        public dataQualities = new Array<string>(),
    ) { }
}
