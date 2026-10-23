import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NewReport } from './new-report';

describe('NewReport', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReport],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NewReport);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the step one heading', () => {
    const fixture = TestBed.createComponent(NewReport);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Nuevo Reporte de Barrera Arquitectónica',
    );
  });
});
