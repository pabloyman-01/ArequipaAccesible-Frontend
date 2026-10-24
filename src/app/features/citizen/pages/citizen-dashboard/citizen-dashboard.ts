import { Component } from '@angular/core';
import { ReportList } from '../../../../shared/report-list/report-list';
@Component({
  selector: 'app-citizen-dashboard',
  imports: [ReportList],
  template: '<app-report-list [welcome]="true" />',
})
export class CitizenDashboard {}
