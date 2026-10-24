import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { Users } from './users';

describe('Users', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Users],
      providers: uiTestProviders(),
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Users);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the users heading', () => {
    const fixture = TestBed.createComponent(Users);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Gestión de Usuarios');
  });
});
