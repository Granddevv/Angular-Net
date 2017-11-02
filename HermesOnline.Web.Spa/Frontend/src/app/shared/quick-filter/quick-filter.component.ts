import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { QuickFilterListItemModel } from '../../models/common/quick-filter-list-item.model';

@Component({
  selector: 'app-quick-filter',
  templateUrl: './quick-filter.component.html',
  styleUrls: ['./quick-filter.component.scss']
})
export class QuickFilterComponent implements OnChanges {

  @Input()
  public filterList: QuickFilterListItemModel[];

  @Output()
  filterSubmitted = new EventEmitter();

  public status: { isopen: boolean } = { isopen: false };
  selectAll = true;
  isButtonDisabled = false;

  constructor() { }

  onSelectAll() {
    this.filterList.forEach(x => x.isChecked = this.selectAll);
    this.checkIsSubmitButtonDisabled();
  }

  ngOnChanges(): void {
    this.selectAll = this.filterList.length === this.filterList.filter(x => x.isChecked).length;
  }

  onSelectSingle(isChecked: boolean) {
    this.checkIsSubmitButtonDisabled();
    this.selectAll = this.filterList.length === this.filterList.filter(x => x.isChecked).length;
  }

  applyFilter() {
    this.filterSubmitted.emit();
    this.status = { isopen: false };
  }

  openDropdown() {
    if (this.filterList.length !== 1) {
      this.status = { isopen: true };
    }
  }

  private checkIsSubmitButtonDisabled() {
    if (this.filterList.some(x => x.isChecked)) {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
  }
}
