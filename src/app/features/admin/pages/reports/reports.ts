import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportList } from '../../../../shared/report-list/report-list';
@Component({
  selector: 'app-reports',
  imports: [ReportList, RouterLink],
  template: `
    <a class="btn-secondary mb-4" routerLink="/prioridades">Bandeja de prioridad</a>
    <app-report-list [admin]="true" />
  `,
})
export class Reports {}
