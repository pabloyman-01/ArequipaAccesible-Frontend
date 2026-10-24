import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { RuntimeConfigService } from './runtime-config.service';

describe('Backend HTTP integration contract', () => {
  let api: ApiService, http: HttpTestingController, auth: { token: jasmine.Spy };
  beforeEach(() => {
    auth = { token: jasmine.createSpy().and.resolveTo('unit-test-token') };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('attaches the current access token only to the configured backend', async () => {
    const pending = api.reportes(false, {
      estado: 'EN_EVALUACION',
      cursor: 'cursor-prueba',
      codigo: '',
    });
    await Promise.resolve();
    const request = http.expectOne('/api/reportes?estado=EN_EVALUACION&cursor=cursor-prueba');
    expect(request.request.headers.get('Authorization')).toBe('Bearer unit-test-token');
    request.flush({ elementos: [], limite: 20, hayMas: false, siguienteCursor: null });
    await pending;
    const other = firstValueFrom(
      TestBed.inject(HttpClient).get('https://other.example.test/api/reportes'),
    );
    http.expectOne('https://other.example.test/api/reportes').flush({});
    await other;
    expect(auth.token).toHaveBeenCalledTimes(1);
  });
  it('does not attach the token to lookalike paths or origins', async () => {
    const config = TestBed.inject(RuntimeConfigService);
    for (const url of [
      '/api-evil/reportes',
      'https://other.example.test/api',
      'https://localhost.evil.example.test/api/reportes',
    ])
      expect(config.isApiRequest(url)).toBeFalse();
  });
  it('sends multipart data with the browser boundary and the original photo', async () => {
    const photo = new Blob(['fixture'], { type: 'image/png' });
    const pending = api.crear(
      { tipoBarreraId: 1, severidadDeclarada: 'BAJA' },
      photo,
      'fixture.png',
    );
    await Promise.resolve();
    const request = http.expectOne('/api/reportes');
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.has('Content-Type')).toBeFalse();
    const form = request.request.body as FormData;
    expect(form.getAll('foto').length).toBe(1);
    expect((form.get('foto') as File).type).toBe('image/png');
    expect(JSON.parse(await (form.get('datos') as Blob).text())).toEqual({
      tipoBarreraId: 1,
      severidadDeclarada: 'BAJA',
    });
    request.flush({ id: 1, codigo: 'ARQ-2026-000001', estado: 'RECIBIDO' });
    expect((await pending).estado).toBe('RECIBIDO');
  });
  it('fetches a private image as an authenticated blob, without a public bucket URL', async () => {
    const pending = api.foto(1, 2);
    await Promise.resolve();
    const request = http.expectOne('/api/reportes/1/fotos/2');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.headers.has('Authorization')).toBeTrue();
    const blob = new Blob(['fixture'], { type: 'image/png' });
    request.flush(blob);
    expect(await pending).toBe(blob);
  });
  it('preserves expected state, reason and 409 conflicts without retrying writes', async () => {
    const pending = api
      .cambiarReporte(1, 'EN_EVALUACION', 'RECHAZADO', ' Motivo de prueba ')
      .catch((e) => e);
    await Promise.resolve();
    const request = http.expectOne('/api/admin/reportes/1/estado');
    expect(request.request.body).toEqual({
      estadoEsperado: 'EN_EVALUACION',
      nuevoEstado: 'RECHAZADO',
      motivo: 'Motivo de prueba',
    });
    request.flush({ code: 'ESTADO_CONFLICTO' }, { status: 409, statusText: 'Conflict' });
    expect(((await pending) as HttpErrorResponse).status).toBe(409);
  });
  it('sends no authorization header when there is no session', async () => {
    auth.token.and.resolveTo(undefined);
    const pending = api.get('/catalogos/distritos');
    await Promise.resolve();
    const request = http.expectOne('/api/catalogos/distritos');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush([]);
    await pending;
  });
});
