import { Component, input } from '@angular/core';
import { BarrierDistributionItem, BarrierTone } from '../../models/dashboard.models';

interface BarrierTheme {
  text: string;
  icon: string;
  bar: string;
}

const BARRIER_THEMES: Record<BarrierTone, BarrierTheme> = {
  primary: {
    text: 'text-primary',
    icon: 'text-primary',
    bar: 'bg-primary',
  },
  secondary: {
    text: 'text-secondary',
    icon: 'text-secondary',
    bar: 'bg-secondary',
  },
  tertiary: {
    text: 'text-tertiary',
    icon: 'text-tertiary',
    bar: 'bg-tertiary',
  },
};

@Component({
  selector: 'app-barrier-distribution',
  templateUrl: './barrier-distribution.html',
})
export class BarrierDistribution {
  readonly items = input.required<BarrierDistributionItem[]>();

  protected barrierTheme(tone: BarrierTone): BarrierTheme {
    return BARRIER_THEMES[tone];
  }
}
