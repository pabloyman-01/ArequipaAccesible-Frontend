import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MyReports } from './my-reports';

describe('MyReports', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReports],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyReports);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the reports heading', () => {
    const fixture = TestBed.createComponent(MyReports);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Mis Reportes Registrados');
  });
});
