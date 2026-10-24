import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportSeverity, UrgentReport } from '../../models/dashboard.models';

interface SeverityMeta {
  label: string;
  badge: string;
  dot: string;
}

const SEVERITY_META: Record<ReportSeverity, SeverityMeta> = {
  critical: {
    label: 'Urgencia Crítica',
    badge: 'bg-error-container text-on-error-container',
    dot: 'bg-error animate-ping',
  },
  high: {
    label: 'Impacto Alto',
    badge: 'bg-secondary-fixed text-on-secondary-fixed',
    dot: 'bg-secondary',
  },
  risk: {
    label: 'Riesgo Caída',
    badge: 'bg-error-container text-on-error-container',
    dot: 'bg-error',
  },
};

@Component({
  selector: 'app-urgent-dispatch',
  host: { class: 'lg:col-span-5' },
  imports: [RouterLink],
  templateUrl: './urgent-dispatch.html',
})
export class UrgentDispatch {
  readonly reports = input.required<UrgentReport[]>();

  protected severityMeta(severity: ReportSeverity): SeverityMeta {
    return SEVERITY_META[severity];
  }
}
