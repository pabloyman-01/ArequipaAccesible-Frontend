import { Component, HostListener, input, output, signal } from '@angular/core';
import {
  ReportBarrierTone,
  ReportRow,
  ReportSecondaryAction,
  ReportStatus,
} from '../../models/report.models';

interface StatusMeta {
  label: string;
  button: string;
  dot: string;
  menuActive: string;
  icon: string;
}

const STATUS_META: Record<ReportStatus, StatusMeta> = {
  recibido: {
    label: 'Recibido',
    button:
      'bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
    dot: 'bg-outline',
    menuActive: 'bg-surface-container text-on-surface font-bold',
    icon: 'text-outline',
  },
  'en-proceso': {
    label: 'En Proceso',
    button:
      'bg-surface-container-high text-on-secondary-container hover:bg-surface-variant',
    dot: 'bg-secondary-container',
    menuActive: 'bg-surface-container-high text-primary font-bold',
    icon: 'text-outline',
  },
  atendido: {
    label: 'Atendido',
    button:
      'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim',
    dot: 'bg-tertiary',
    menuActive: 'bg-tertiary-fixed text-on-tertiary-fixed font-bold',
    icon: 'text-on-tertiary-fixed',
  },
  rechazado: {
    label: 'Rechazado',
    button:
      'bg-error-container text-on-error-container hover:bg-error/20',
    dot: 'bg-error',
    menuActive: 'bg-error-container text-on-error-container font-bold',
    icon: 'text-on-error-container',
  },
};

interface BarrierToneMeta {
  badge: string;
  dot: string;
}

const BARRIER_TONE_META: Record<ReportBarrierTone, BarrierToneMeta> = {
  secondary: {
    badge: 'bg-secondary-fixed text-on-secondary-container',
    dot: 'bg-secondary',
  },
  error: {
    badge: 'bg-error-container text-on-error-container',
    dot: 'bg-error',
  },
  tertiary: {
    badge: 'bg-tertiary-fixed text-on-tertiary-fixed',
    dot: 'bg-tertiary',
  },
  neutral: {
    badge: 'bg-surface-variant text-on-surface-variant',
    dot: 'bg-outline',
  },
};

interface SecondaryActionMeta {
  icon: string;
  label: string;
}

const SECONDARY_ACTION_META: Record<ReportSecondaryAction, SecondaryActionMeta> = {
  assign: { icon: 'assignment_ind', label: 'Asignar cuadrilla' },
  document: { icon: 'verified', label: 'Descargar acta' },
  info: { icon: 'info', label: 'Ver motivo de desestimación' },
};

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.html',
})
export class ReportsTable {
  readonly reports = input.required<ReportRow[]>();
  readonly total = input.required<number>();
  readonly statusChange = output<{ key: string; status: ReportStatus }>();

  protected readonly statusOptions: ReportStatus[] = [
    'recibido',
    'en-proceso',
    'atendido',
    'rechazado',
  ];

  protected readonly openMenuKey = signal<string | null>(null);

  protected statusMeta(status: ReportStatus): StatusMeta {
    return STATUS_META[status];
  }

  protected barrierToneMeta(tone: ReportBarrierTone): BarrierToneMeta {
    return BARRIER_TONE_META[tone];
  }

  protected secondaryActionMeta(action: ReportSecondaryAction): SecondaryActionMeta {
    return SECONDARY_ACTION_META[action];
  }

  protected toggleStatusMenu(key: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuKey.update((current) => (current === key ? null : key));
  }

  protected chooseStatus(key: string, status: ReportStatus, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuKey.set(null);
    this.statusChange.emit({ key, status });
  }

  @HostListener('document:click')
  protected closeStatusMenu(): void {
    this.openMenuKey.set(null);
  }

  @HostListener('document:keydown.escape')
  protected closeStatusMenuOnEscape(): void {
    this.openMenuKey.set(null);
  }
}
