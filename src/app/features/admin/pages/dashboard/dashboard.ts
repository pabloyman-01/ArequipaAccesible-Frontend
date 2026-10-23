import { Component, inject } from '@angular/core';
import { BarrierDistribution } from '../../components/barrier-distribution/barrier-distribution';
import { ComplianceCard } from '../../components/compliance-card/compliance-card';
import { IncidentMap } from '../../components/incident-map/incident-map';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { UrgentDispatch } from '../../components/urgent-dispatch/urgent-dispatch';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [KpiCard, IncidentMap, UrgentDispatch, BarrierDistribution, ComplianceCard],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  protected readonly data = this.dashboardService.data;
}
