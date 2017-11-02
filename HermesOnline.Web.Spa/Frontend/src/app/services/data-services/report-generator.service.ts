import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../common-services/http.service';
import { GenerateDataExtractModel } from '../../models/manager-view/finding-overview/generate-data-extract/generate-data-extract.model';
import { NodeType } from '../../models/manager-view/common/model/node-type';
import { UserManagementTableFilterModel } from '../../models/users-management/user-management-table.model';
import { DefectChangeLogsTableFilterModel } from '../../models/manager-view/finding-overview/common/findings/findings-change-log.model';

@Injectable()
export class ReportGeneratorService {
    private readonly urlBase = '/api/reportGenerator';

    constructor(private http: HttpService) { }

    reportGenerationStart(): Observable<string> {
        return this.http.get(`${this.urlBase}/reportGenerationStart`, null, false).map(data => data.json());
    }

    reportGenerationCancel(taskId: string): Observable<any> {
        return this.http.get(`${this.urlBase}/reportGenerationCancel/${taskId}`, null, false).map(data => data.json());
    }

    generateGetReportFileUrl(fileName: string): string {
        return `${this.urlBase}/getReportFile//${fileName}`;
    }

    getReportGenerationProgress(taskId: string): Observable<any> {
        return this.http.get(`${this.urlBase}/reportGenerationProgress/${taskId}`, null, false).map(data => data.json());
    }

    getDataExtractReport(data: GenerateDataExtractModel): Observable<Response> {
        return this.http.post(`${this.urlBase}/dataExtractReport`, data, null, false);
    }

    getBladeHealthReport(nodeId: string, nodeType: NodeType, taskId: string): Observable<Response> {
        return this.http.get(`${this.urlBase}/bladeHealthReport/${nodeId}/${nodeType}/${taskId}`, null, false);
    }

    getComparisonReport(nodeId: string, nodeType: NodeType, selectedYearFrom: number,
        selectedYearTo: number, taskId: string): Observable<Response> {
        return this.http.get(`${this.urlBase}/comparisonReport/${nodeId}/${nodeType}/${selectedYearFrom}/${selectedYearTo}/${taskId}`,
            null, false);
    }

    getRepairReport(data: any, taskId: string, nodeType: NodeType, nodeId: string): Observable<Response> {
        return this.http.post(`${this.urlBase}/repairReport/${taskId}/${nodeType}/${nodeId}`, data, null, false);
    }

    getYears(nodeId: string, nodeType: NodeType): Observable<Array<number>> {
        return this.http.get(`${this.urlBase}/inspectionYearsForComparisonReport/${nodeId}/${nodeType}`).map(data => data.json());
    }

    generateUserListReport(quickFilter: UserManagementTableFilterModel, taskId: string): Observable<any> {
        return this.http.post(`/api/reportgenerator/userlistreport/${taskId}`, JSON.stringify(quickFilter))
            .map(data => data.json() || {});
    }

    generateFindingChangeLogReport(quickFilter: DefectChangeLogsTableFilterModel, taskId: string): Observable<any> {
        return this.http.post(`/api/reportgenerator/findingListReport/${taskId}`, JSON.stringify(quickFilter))
            .map(data => data.json() || {});
    }
}
