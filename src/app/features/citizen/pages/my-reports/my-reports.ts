import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyReport, MyReportStatus } from '../../models/my-reports.models';
import { MyReportsService } from '../../services/my-reports.service';

type ReportFilter = 'all' | 'progress' | 'resolved';

interface StatusMeta {
  label: string;
  icon: string;
  badge: string;
  progress: string;
}

const STATUS_META: Record<MyReportStatus, StatusMeta> = {
  evaluation: { label: 'En Evaluación Técnica', icon: 'analytics', badge: 'bg-tertiary-fixed text-on-tertiary-fixed', progress: 'bg-tertiary-container' },
  scheduled: { label: 'Cuadrilla Programada', icon: 'circle', badge: 'bg-secondary-fixed text-on-secondary-fixed', progress: 'bg-secondary-container' },
  work: { label: 'En Proceso', icon: 'construction', badge: 'bg-secondary text-on-secondary', progress: 'bg-secondary' },
  resolved: { label: 'Resuelto y Conforme', icon: 'check_circle', badge: 'bg-surface-container-high text-primary', progress: 'bg-primary' },
};

@Component({
  selector: 'app-my-reports',
  imports: [RouterLink],
  templateUrl: './my-reports.html',
})
export class MyReports {
  private readonly reportsService = inject(MyReportsService);

  protected readonly metrics = this.reportsService.metrics;
  protected readonly totalRegistered = this.reportsService.totalRegistered;
  protected readonly filter = signal<ReportFilter>('all');
  protected readonly search = signal('');

  protected readonly reports = computed(() => {
    const filter = this.filter();
    const search = this.normalize(this.search().trim());

    return this.reportsService.reports.filter((report) => {
      const matchesFilter = filter === 'all' || (filter === 'resolved' ? report.status === 'resolved' : report.status !== 'resolved');
      const matchesSearch = !search || [report.id, report.title, report.location].some((value) => this.normalize(value).includes(search));
      return matchesFilter && matchesSearch;
    });
  });

  protected statusMeta(status: MyReportStatus): StatusMeta {
    return STATUS_META[status];
  }

  protected severityClass(report: MyReport): string {
    return report.severityTone === 'critical'
      ? 'bg-error-container text-on-error-container'
      : 'bg-surface-container text-on-surface-variant';
  }

  protected metricIconClass(tone: string): string {
    return {
      primary: 'bg-surface-container-high text-primary',
      tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed',
      secondary: 'bg-secondary-fixed text-on-secondary-fixed',
      neutral: 'bg-surface-container-high text-primary-container',
    }[tone] ?? 'bg-surface-container-high text-primary';
  }

  protected metricValueClass(tone: string): string {
    return { primary: 'text-on-surface', tertiary: 'text-tertiary-container', secondary: 'text-secondary', neutral: 'text-on-surface' }[tone] ?? 'text-on-surface';
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}
