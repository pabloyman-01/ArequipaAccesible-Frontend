import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitizenReport, CitizenReportStatus } from '../../models/citizen.models';
import { CitizenDashboardService } from '../../services/citizen-dashboard.service';

interface ReportStatusMeta {
  label: string;
  badge: string;
  icon: string;
  progress: string;
  detail: string;
}

const REPORT_STATUS_META: Record<CitizenReportStatus, ReportStatusMeta> = {
  'en-proceso': {
    label: 'Cuadrilla en Sitio',
    badge: 'bg-secondary-fixed/50 text-secondary',
    icon: 'circle',
    progress: 'bg-secondary-container',
    detail: 'text-on-surface-variant',
  },
  atendido: {
    label: 'Resuelto y Conforme',
    badge: 'bg-tertiary-fixed text-tertiary-container',
    icon: 'check_circle',
    progress: 'bg-tertiary-container',
    detail: 'text-tertiary',
  },
  evaluacion: {
    label: 'En Evaluación Técnica',
    badge: 'bg-surface-container text-on-surface-variant',
    icon: 'hourglass_empty',
    progress: 'bg-primary',
    detail: 'text-on-surface-variant',
  },
};

@Component({
  selector: 'app-citizen-dashboard',
  imports: [RouterLink],
  templateUrl: './citizen-dashboard.html',
})
export class CitizenDashboard {
  private readonly dashboardService = inject(CitizenDashboardService);

  protected readonly metrics = this.dashboardService.metrics;
  protected readonly selectedStatus = signal<CitizenReportStatus | ''>('');
  protected readonly search = signal('');

  protected readonly filteredReports = computed(() => {
    const selectedStatus = this.selectedStatus();
    const search = this.normalize(this.search().trim());

    return this.dashboardService.reports.filter((report) => {
      const matchesStatus = !selectedStatus || report.status === selectedStatus;
      const matchesSearch =
        !search ||
        [report.id, report.title, report.location].some((value) =>
          this.normalize(value).includes(search),
        );

      return matchesStatus && matchesSearch;
    });
  });

  protected statusMeta(status: CitizenReportStatus): ReportStatusMeta {
    return REPORT_STATUS_META[status];
  }

  protected selectStatus(status: CitizenReportStatus | ''): void {
    this.selectedStatus.set(status);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
