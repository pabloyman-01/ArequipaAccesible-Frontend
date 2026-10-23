import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
  });

  it('should load the user list', () => {
    expect(service.users.length).toBe(7);
    expect(service.totalRegistered).toBe(1842);
  });

  it('should expose the user summary indicators', () => {
    expect(service.kpis.length).toBe(5);
    expect(service.kpis.map((kpi) => kpi.id)).toContain('pending-validations');
  });
});
