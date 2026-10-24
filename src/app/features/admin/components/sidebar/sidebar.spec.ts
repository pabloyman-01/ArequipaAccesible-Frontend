import { AuthService } from '../../../../core/auth.service';
import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AdminSidebar } from './sidebar';

describe('AdminSidebar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSidebar],
      providers: [...uiTestProviders(), provideRouter([])],
    }).compileComponents();
  });

  it('navigates to the login page when signing out', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    const router = TestBed.inject(Router);
    const signOut = TestBed.inject(AuthService).signOut;

    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button',
    );
    expect(button).not.toBeNull();
    button!.click();

    expect(signOut).toHaveBeenCalled();
  });
});
