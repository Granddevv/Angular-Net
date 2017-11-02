export interface IQuickFilter<T1, T2> {
    quickFiltersList: T1;
    appliedQuickFiltersColumnProps: any;
    updateQuickFilterListOfNonAppliedFilters(data: T1): void;
    updateQuickFilterListOfAppliedFilters(data: T1, columnProp: string): void;
    initializeQuickFiltersForTableFilterModel(columnProp?: string): void;
    getCheckedQuickFiltersModel(excludeQuickFilterColumnProp?: string): T2;
}
