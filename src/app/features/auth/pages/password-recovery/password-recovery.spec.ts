import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PasswordRecovery } from './password-recovery';

describe('PasswordRecovery', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecovery],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render the recovery heading', () => {
    const fixture = TestBed.createComponent(PasswordRecovery);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Recupera tu contraseña');
  });
});
