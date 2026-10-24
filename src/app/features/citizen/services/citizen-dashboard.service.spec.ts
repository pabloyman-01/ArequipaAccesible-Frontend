import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CitizenDashboardService } from './citizen-dashboard.service';
describe('CitizenDashboardService', () => {
  it('requests the backend collection and preserves its real empty page', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(CitizenDashboardService),
      http = TestBed.inject(HttpTestingController);
    const pending = service.listar({ limite: 20, cursor: 'cursor-de-prueba' });
    const request = http.expectOne('/api/reportes?limite=20&cursor=cursor-de-prueba');
    expect(request.request.method).toBe('GET');
    request.flush({ elementos: [], limite: 20, hayMas: false, siguienteCursor: null });
    expect((await pending).elementos).toEqual([]);
    http.verify();
  });
});
