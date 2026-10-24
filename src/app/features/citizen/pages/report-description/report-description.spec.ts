import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReportDescription } from './report-description';

describe('ReportDescription', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDescription],
      providers: [...uiTestProviders(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReportDescription);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the detailed description section', () => {
    const fixture = TestBed.createComponent(ReportDescription);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Descripción del Reporte');
  });

  it('renders the voice dictation control', () => {
    const fixture = TestBed.createComponent(ReportDescription);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Dictar descripción por voz',
    );
  });
});
