import { Component, input } from '@angular/core';
import { ComplianceSummary } from '../../models/dashboard.models';

@Component({
  selector: 'app-compliance-card',
  templateUrl: './compliance-card.html',
})
export class ComplianceCard {
  readonly compliance = input.required<ComplianceSummary>();
}
