import { TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../../../core/auth.service';
import { uiTestProviders } from '../../../../testing/ui-providers';

describe('Email rate limit feedback', () => {
  it('shows the limit and prevents another email request without blocking password login', async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: uiTestProviders(),
    }).compileComponents();
    const auth = TestBed.inject(AuthService);
    (auth.loginWithLink as jasmine.Spy).and.rejectWith({ code: 'over_email_send_rate_limit' });
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.email = 'fixture@example.test';
    fixture.detectChanges();
    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((b) => b.textContent?.includes('Ingresar con enlace'))!;
    button.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('limitó temporalmente');
    expect(button.disabled).toBeTrue();
    button.click();
    expect(auth.loginWithLink).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeFalse();
  });
});
