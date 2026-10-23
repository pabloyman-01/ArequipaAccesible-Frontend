import { TestBed } from '@angular/core/testing';
import { MyReportsService } from './my-reports.service';

describe('MyReportsService', () => {
  it('should provide the citizen report history', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(MyReportsService);
    expect(service.reports.length).toBe(4);
    expect(service.totalRegistered).toBe(16);
  });
});
