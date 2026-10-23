import { Component, input } from '@angular/core';
import { UserKpi, UserKpiTone } from '../../models/user.models';

interface UserKpiTheme {
  iconWrapper: string;
  value: string;
  emphasis: string;
}

const KPI_THEMES: Record<UserKpiTone, UserKpiTheme> = {
  neutral: {
    iconWrapper: 'bg-surface-container text-primary-container',
    value: 'text-on-surface',
    emphasis: 'text-secondary',
  },
  admin: {
    iconWrapper: 'bg-primary-fixed text-primary-container',
    value: 'text-primary-container',
    emphasis: 'text-on-surface-variant',
  },
  citizen: {
    iconWrapper: 'bg-secondary-fixed text-secondary',
    value: 'text-on-surface',
    emphasis: 'text-on-surface-variant',
  },
  verified: {
    iconWrapper: 'bg-tertiary-fixed text-tertiary',
    value: 'text-on-surface',
    emphasis: 'text-outline',
  },
  pending: {
    iconWrapper: 'bg-error-container text-error',
    value: 'text-error',
    emphasis: 'text-outline',
  },
};

@Component({
  selector: 'app-users-kpis',
  templateUrl: './users-kpis.html',
})
export class UsersKpis {
  readonly kpis = input.required<UserKpi[]>();

  protected theme(tone: UserKpiTone): UserKpiTheme {
    return KPI_THEMES[tone];
  }
}
