import { TestBed } from '@angular/core/testing';
import { Reports } from './reports';

describe('Reports', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Reports);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the reports heading', () => {
    const fixture = TestBed.createComponent(Reports);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Panel de Gestión de Reportes',
    );
  });
});
