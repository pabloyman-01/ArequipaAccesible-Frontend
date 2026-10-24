import { AuthService } from '../../../../core/auth.service';
import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { CitizenSidebar } from './citizen-sidebar';

describe('CitizenSidebar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenSidebar],
      providers: [...uiTestProviders(), provideRouter([])],
    }).compileComponents();
  });

  it('navigates to the login page when signing out', () => {
    const fixture = TestBed.createComponent(CitizenSidebar);
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
