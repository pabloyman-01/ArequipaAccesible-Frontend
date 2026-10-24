import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CitizenDashboard } from './citizen-dashboard';

describe('CitizenDashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenDashboard],
      providers: [...uiTestProviders(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CitizenDashboard);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the citizen welcome heading', () => {
    const fixture = TestBed.createComponent(CitizenDashboard);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Mi panel ciudadano',
    );
  });
});
