import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReportEvidence } from './report-evidence';

describe('ReportEvidence', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportEvidence],
      providers: [provideRouter([])],
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
    expect(inputs[0].getAttribute('accept')).toBe('image/*');
    expect(page.textContent).toContain('Tomar foto');
  });

  it('renders an interactive map and current location control', () => {
    const fixture = TestBed.createComponent(ReportEvidence);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('[aria-label="Mapa interactivo para seleccionar la ubicación del reporte"]')).toBeTruthy();
    expect(page.textContent).toContain('Usar mi ubicación GPS actual');
  });
});
