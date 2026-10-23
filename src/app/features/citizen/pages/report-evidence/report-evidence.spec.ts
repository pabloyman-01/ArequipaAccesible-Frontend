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
});
