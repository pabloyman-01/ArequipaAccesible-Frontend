import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../core/api.service';
import { ReportDraftService } from '../core/report-draft.service';
import { ReportList } from './report-list/report-list';
import { ReportDescription } from '../features/citizen/pages/report-description/report-description';
import { uiTestProviders } from '../testing/ui-providers';

describe('Connected citizen report flow', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportList, ReportDescription],
      providers: uiTestProviders(),
    }).compileComponents();
  });
  it('keeps the applied filters across cursor pages, and starts over when filters change', async () => {
    const api = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    const component = TestBed.createComponent(ReportList).componentInstance;
    api.reportes.and.resolveTo({
      elementos: [],
      limite: 20,
      hayMas: true,
      siguienteCursor: 'next-fixture',
    });
    component.estado = 'EN_EVALUACION';
    await component.apply();
    component.estado = 'ATENDIDO';
    await component.load(1);
    expect(api.reportes.calls.mostRecent().args).toEqual([
      false,
      jasmine.objectContaining({ estado: 'EN_EVALUACION', cursor: 'next-fixture' }),
    ]);
    await component.apply();
    expect(api.reportes.calls.mostRecent().args).toEqual([
      false,
      jasmine.objectContaining({ estado: 'ATENDIDO', cursor: null }),
    ]);
    expect(component.index).toBe(0);
  });
  it('does not present network errors as an empty successful list', async () => {
    const api = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    api.reportes.and.rejectWith(new HttpErrorResponse({ status: 0 }));
    const component = TestBed.createComponent(ReportList).componentInstance;
    await component.load(0);
    expect(component.page()).toBeNull();
    expect(component.error()).toContain('backend');
  });
  function readyDraft() {
    const draft = TestBed.inject(ReportDraftService);
    draft.tipoBarreraId.set(1);
    draft.distritoId.set(1);
    draft.ubicacion.set({ lat: -16.3989, lng: -71.535 });
    draft.direccion.set('Referencia de prueba');
    draft.descripcion.set('Reporte de prueba');
    draft.foto.set(new Blob(['fixture'], { type: 'image/png' }));
    draft.nombreFoto.set('fixture.png');
    return draft;
  }
  it('registers once, shows the backend-generated code and clears the private draft', async () => {
    const draft = readyDraft(),
      api = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    api.crear.and.resolveTo({ id: 7, codigo: 'ARQ-2026-000007', estado: 'RECIBIDO' });
    const fixture = TestBed.createComponent(ReportDescription);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button.btn').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.crear).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('ARQ-2026-000007');
    expect(draft.foto()).toBeNull();
    expect(draft.descripcion()).toBe('');
  });
  it('blocks duplicate clicks and retries after an ambiguous write response', async () => {
    const draft = readyDraft(),
      api = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    api.crear.and.rejectWith(new HttpErrorResponse({ status: 0 }));
    const fixture = TestBed.createComponent(ReportDescription);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button.btn') as HTMLButtonElement;
    button.click();
    button.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.crear).toHaveBeenCalledTimes(1);
    expect(draft.uncertain()).toBeTrue();
    expect(button.disabled).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Consulta Mis Reportes');
  });
  it('does not send a report with a missing photo or location', async () => {
    const api = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    const fixture = TestBed.createComponent(ReportDescription);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button.btn').click();
    await fixture.whenStable();
    expect(api.crear).not.toHaveBeenCalled();
  });
});
