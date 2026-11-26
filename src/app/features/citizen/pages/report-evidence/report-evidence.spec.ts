import { ApiService } from '../../../../core/api.service';
import { ReportDraftService } from '../../../../core/report-draft.service';
import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReportEvidence } from './report-evidence';

describe('ReportEvidence', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportEvidence],
      providers: [...uiTestProviders(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReportEvidence);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the photographic evidence section', () => {
    const fixture = TestBed.createComponent(ReportEvidence);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Evidencia Fotográfica');
  });

  it('provides camera and file upload controls for photographic evidence', () => {
    const fixture = TestBed.createComponent(ReportEvidence);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const inputs = page.querySelectorAll('input[type="file"]');

    expect(inputs.length).toBe(1);
    expect(inputs[0].getAttribute('accept')).toBe('image/jpeg,image/png');
    expect(page.textContent).toContain('Tomar foto');
  });

  it('renders an interactive map and current location control', () => {
    const fixture = TestBed.createComponent(ReportEvidence);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;

    expect(
      page.querySelector(
        '[aria-label="Mapa interactivo para seleccionar la ubicación del reporte"]',
      ),
    ).toBeTruthy();
    expect(page.textContent).toContain('Usar mi ubicación GPS actual');
  });
  it('shows the selected type and only changes it when an AI suggestion is accepted', async () => {
    const api = TestBed.inject(ApiService);
    (api.catalogos as jasmine.Spy).and.resolveTo([[], [{ id: 1, nombre: 'Obstáculo' }]]);
    (api.disponibilidadClasificacion as jasmine.Spy).and.resolveTo({ disponible: true });
    (api.sugerirBarrera as jasmine.Spy).and.resolveTo({ tipoBarreraId: 2, nombre: 'Rampa' });
    const draft = TestBed.inject(ReportDraftService);
    draft.foto.set(new Blob(['fixture'], { type: 'image/png' }));
    draft.nombreFoto.set('test.png');
    const fixture = TestBed.createComponent(ReportEvidence);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('Obstáculo');
    const click = (text: string) =>
      [...page.querySelectorAll('button')].find((b) => b.textContent?.includes(text))!.click();
    click('Sugerir tipo con IA');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(draft.tipoBarreraId()).toBe(1);
    click('Usar sugerencia');
    fixture.detectChanges();
    expect(draft.tipoBarreraId()).toBe(2);
    expect(page.textContent).toContain('Rampa');
  });
});
