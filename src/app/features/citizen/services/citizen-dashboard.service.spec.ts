import { TestBed } from '@angular/core/testing';
import { CitizenDashboardService } from './citizen-dashboard.service';

describe('CitizenDashboardService', () => {
  it('should provide dashboard metrics and reports', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(CitizenDashboardService);

    expect(service.metrics.length).toBe(3);
    expect(service.reports.length).toBe(4);
  });
});
