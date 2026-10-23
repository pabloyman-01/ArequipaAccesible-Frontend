import { Component, computed, input } from '@angular/core';
import { DashboardKpi, KpiTone } from '../../models/dashboard.models';

interface KpiTheme {
  card: string;
  label: string;
  iconWrapper: string;
  value: string;
  detail: string;
  indicatorIcon: string;
  indicatorDot: string;
}

const KPI_THEMES: Record<KpiTone, KpiTheme> = {
  default: {
    card: 'border-outline-variant/40 bg-surface-container-lowest',
    label: 'text-on-surface-variant',
    iconWrapper: 'bg-surface-container text-primary',
    value: 'text-on-surface',
    detail: 'text-primary',
    indicatorIcon: 'text-[16px] text-primary',
    indicatorDot: '',
  },
  attention: {
    card: 'border-outline-variant/40 bg-surface-container-lowest',
    label: 'text-on-surface-variant',
    iconWrapper: 'bg-secondary-fixed text-on-secondary-fixed',
    value: 'text-secondary',
    detail: 'text-on-surface-variant font-medium',
    indicatorIcon: '',
    indicatorDot: 'bg-secondary animate-pulse',
  },
  success: {
    card: 'border-outline-variant/40 bg-surface-container-lowest',
    label: 'text-on-surface-variant',
    iconWrapper: 'bg-primary-fixed text-primary',
    value: 'text-primary',
    detail: 'text-primary',
    indicatorIcon: '',
    indicatorDot: '',
  },
  critical: {
    card: 'border-error/20 bg-error-container/30',
    label: 'text-on-error-container',
    iconWrapper: 'bg-error text-on-error shadow-sm',
    value: 'text-error',
    detail: 'text-error',
    indicatorIcon: '',
    indicatorDot: 'bg-error animate-ping',
  },
};

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.html',
})
export class KpiCard {
  readonly kpi = input.required<DashboardKpi>();

  protected readonly theme = computed(() => KPI_THEMES[this.kpi().tone]);
}
