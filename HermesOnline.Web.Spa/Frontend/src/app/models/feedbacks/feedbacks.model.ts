import { FeedbackQuickFilterModel } from './feedback-quick-filter-list.model';

export class FeedbacksTableModel {
    feedbacksTableRows: FeedbacksTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class FeedbacksTableRowModel {
    public id: string;
    public date: string;
    public user: string;
    public type: FeedbackType;
    public category: FeedbackCategory;
    public description: string;
    public fileName: string;
    public status: FeedbackStatus;
    public comment: string;
    public url: string;
}

export class FeedbacksTableFilterModel {
    public searchUser: string;
    constructor(public pageSize: number = 15,
        public pageIndex: number = 0,
        public sortProperty?: string,
        public quickFilters?: FeedbackQuickFilterModel,
        public sortDirection: number = 0) {
    }
}

export enum FeedbackStatus {
    Resolved = 0,
    Rejected = 1,
    Submitted = 2
}

export enum FeedbackType {
    Bug = 0,
    Other = 1,
    Suggestion = 2,
}

export enum FeedbackCategory {
    DeepZoom = 0,
    DetailView = 1,
    FindingsTable = 2,
    FindingImagePreview = 3,
    Other = 4,
    Reports = 5,
    SummaryView = 6,
    Administration = 7,
}

export class Feedback {
    public id: string;
    public description: string;
    public fileName: string;
    public comment: string;
    public user: string;
    public type: string;
    public category: string;
    public status: FeedbackStatus;
    public notificationOfStatus: boolean;
    public notificationOfLink: boolean;
    public link: string;

    constructor(id?, status?, description?, fileName?, comment?, type?, user?, category?, link?) {
        this.id = id || '';
        this.status = status || '';
        this.description = description || '';
        this.fileName = fileName || '';
        this.comment = comment || '';
        this.type = type || '';
        this.user = user || '';
        this.category = category || '';
        this.link = link || '';
    }
}

export class FeedbackDataTableColumns {
    public static readonly Date = 'Date';
    public static readonly User = 'User';
    public static readonly Type = 'Type';
    public static readonly Category = 'Category';
    public static readonly Description = 'Description';
    public static readonly File = 'File';
    public static readonly Status = 'Status';
    public static readonly Comment = 'Comment';
    public static readonly Url = 'Url';
    public static readonly Actions = 'Actions';
}
