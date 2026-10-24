import { Component } from '@angular/core';
import { ReportList } from '../../../../shared/report-list/report-list';
@Component({ selector: 'app-my-reports', imports: [ReportList], template: '<app-report-list />' })
export class MyReports {}
