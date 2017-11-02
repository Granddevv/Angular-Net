// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PrincipalService } from './principal.service';
import { Tab } from '../../models/manager-view/finding-overview/common/tab/tab';
import { ColumnVisibility } from '../../models/manager-view/finding-overview/column-visibility/column-visibility.constants';
import { FindingsDataTableColumns } from '../../models/manager-view/finding-overview/common/findings/findings-data-table.model';
import { DeepZoomLinkDataTableColumns } from '../../models/manager-view/finding-overview/common/deep-zoom-link/deep-zoom-link-data-table.model';
import { ReportDataTableColumns } from '../../models/manager-view/finding-overview/common/report/report-data-table.model';
import { DefectChangeLogDataTableColumns } from '../../models/manager-view/finding-overview/common/findings/findings-change-log.model';
import { Tables } from '../../models/manager-view/common/model/table-list';

@Injectable()
export class ColumnVisibilityService {
  public columnVisibilityChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private principalService: PrincipalService) { }

  getVisibleColumns(tableName: Tables): any[] {
    const visibleColumns = JSON.parse(localStorage.getItem(ColumnVisibility.columnVisibilityLocalStorage));
    if (!visibleColumns || !visibleColumns.hasOwnProperty(Tables[tableName])) {
      return this.getAllDefaultVisibleColumns(tableName);
    }

    return visibleColumns[Tables[tableName]];
  }

  setVisibleColumns(tableName: Tables, columns: any[]) {
    let visibleColumns = JSON.parse(localStorage.getItem(ColumnVisibility.columnVisibilityLocalStorage));
    if (!visibleColumns) {
      visibleColumns = {};
    }
    visibleColumns[Tables[tableName]] = columns;
    localStorage.setItem(ColumnVisibility.columnVisibilityLocalStorage, JSON.stringify(visibleColumns));
    this.columnVisibilityChanged.next(true);
  }

  private getAllDefaultVisibleColumns(tableName: Tables): any[] {
    const tableColumns = this.getTableColumns(tableName);
    const visibleColumns = [];
    for (const column in tableColumns) {
      if (tableColumns.hasOwnProperty(column)) {
        if (tableColumns[column].permissions && this.principalService.hasAnyPermissions(tableColumns[column].permissions)) {
          visibleColumns.push(
            {
              name: tableColumns[column].name,
              value: tableColumns[column].name,
              checked: tableColumns[column].isDefault
            });
        } else if (!tableColumns[column].permissions) {
          visibleColumns.push(
            {
              name: tableColumns[column].name,
              value: tableColumns[column].name,
              checked: tableColumns[column].isDefault
            });
        }
      }
    }
    return visibleColumns;
  }

  private getTableColumns(tableName: Tables): any {
    switch (tableName) {
      case Tables.Findings:
        return FindingsDataTableColumns;
      case Tables.DeepZoomLinks:
        return DeepZoomLinkDataTableColumns;
      case Tables.Reports:
        return ReportDataTableColumns;
      default:
        console.log('Have not implemented column visibility for that tab.');
    }
  }
}
