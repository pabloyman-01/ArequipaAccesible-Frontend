import { Component } from '@angular/core';
import { ReportList } from '../../../../shared/report-list/report-list';
@Component({
  selector: 'app-reports',
  imports: [ReportList],
  template: '<app-report-list [admin]="true" />',
})
export class Reports {}
