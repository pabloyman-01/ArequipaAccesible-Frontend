import { TestBed } from '@angular/core/testing';
import { CitizenAccount } from './account';

describe('CitizenAccount', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenAccount],
    }).compileComponents();
  });

  it('renders the citizen account page', () => {
    const fixture = TestBed.createComponent(CitizenAccount);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Mi cuenta',
    );
  });
});
