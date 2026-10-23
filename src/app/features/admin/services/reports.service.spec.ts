import { TestBed } from '@angular/core/testing';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsService);
  });

  it('should load the report list', () => {
    expect(service.reports().length).toBe(9);
    expect(service.totalRegistered).toBe(48);
  });

  it('should update the status of a report', () => {
    service.updateStatus('report-2', 'atendido');

    const report = service.reports().find((item) => item.key === 'report-2');
    expect(report?.status).toBe('atendido');
  });
});
