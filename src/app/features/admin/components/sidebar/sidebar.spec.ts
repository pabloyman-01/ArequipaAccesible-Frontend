import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AdminSidebar } from './sidebar';

describe('AdminSidebar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSidebar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('navigates to the login page when signing out', () => {
    const fixture = TestBed.createComponent(AdminSidebar);
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate');

    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button',
    );
    expect(button).not.toBeNull();
    button!.click();

    expect(navigate).toHaveBeenCalledWith(['/inicio-sesion']);
  });
});
