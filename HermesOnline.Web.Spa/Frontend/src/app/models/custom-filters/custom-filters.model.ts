export class CustomFiltersTableModel {
    customFiltersTableRows: CustomFiltersTableRowModel[];
    totalDisplayedRecords: number;
    totalRecords: number;
}

export class CustomFiltersTableRowModel {
    public id: string;
    public date: string;
    public name: string;

    constructor(id?, date?, name?) {
        this.id = id || '';
        this.date = date || '';
        this.name = name || '';
    }
}

export class CustomFiltersTableFilterModel {
    constructor(public pageSize: number = 15,
        public sortProperty?: string,
        public sortDirection: number = 0,
        public pageIndex: number = 0) {
    }
}

export class CustomFilterModel {
    public id: string;
    public name: string;
    public values: string;
}

export class FilterModel {
    public id: string;
    public label: string;
    public type: string;
    public input: string;
    public values: object;
    public operators: Array<string>;
}

export class FilterRuleModel {
    public condition: FilterCondition;
    public rules: Array<any> = new Array<any>();
}

export class FilterSubRuleModel {
    constructor(
        public id: string,
        public operator: string,
        public value: string) {
    }
}

class FilterCondition {
    static AND: string = 'AND';
    static OR: string = 'OR';
}