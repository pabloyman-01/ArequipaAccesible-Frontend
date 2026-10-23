import { Component, computed, inject, signal } from '@angular/core';
import { ReportsFilters } from '../../components/reports-filters/reports-filters';
import { ReportsTable } from '../../components/reports-table/reports-table';
import { ReportStatus } from '../../models/report.models';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  imports: [ReportsFilters, ReportsTable],
  templateUrl: './reports.html',
})
export class Reports {
  private readonly reportsService = inject(ReportsService);

  protected readonly totalRegistered = this.reportsService.totalRegistered;

  protected readonly search = signal('');
  protected readonly district = signal('');
  protected readonly barrierType = signal('');
  protected readonly status = signal<ReportStatus | ''>('');

  protected readonly filteredReports = computed(() => {
    const search = this.normalize(this.search().trim());
    const district = this.district();
    const barrierType = this.barrierType();
    const status = this.status();

    return this.reportsService.reports().filter((report) => {
      const matchesSearch =
        !search ||
        [
          report.id,
          report.citizen.name,
          report.location.address,
          report.location.district,
          report.barrier,
        ].some((value) => this.normalize(value).includes(search));

      const matchesDistrict = !district || report.location.districtKey === district;
      const matchesBarrier = !barrierType || report.barrierType === barrierType;
      const matchesStatus = !status || report.status === status;

      return matchesSearch && matchesDistrict && matchesBarrier && matchesStatus;
    });
  });

  protected changeStatus(event: { key: string; status: ReportStatus }): void {
    this.reportsService.updateStatus(event.key, event.status);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
