import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';
import { AuthService } from '../../../../core/auth.service';
import { Router } from '@angular/router';

describe('Register', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [...uiTestProviders(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('opens profile immediately when Supabase returns a signup session', async () => {
    const auth = TestBed.inject(AuthService);
    (auth.signup as jasmine.Spy).and.resolveTo({ access_token: 'fixture' });
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.email = 'fixture@example.test';
    fixture.componentInstance.password = 'FixturePassword123!';
    fixture.componentInstance.confirmation = 'FixturePassword123!';
    await fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith('/inicio-sesion/completar-perfil');
    expect(fixture.nativeElement.textContent).not.toContain('Revisa tu correo');
    expect(fixture.componentInstance.password).toBe('');
  });
  it('requests confirmation only when signup returns no session', async () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.email = 'fixture@example.test';
    fixture.componentInstance.password = 'FixturePassword123!';
    fixture.componentInstance.confirmation = 'FixturePassword123!';
    await fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Revisa tu correo');
  });
  it('should render the registration heading', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Crea tu Cuenta Ciudadana',
    );
  });
});
