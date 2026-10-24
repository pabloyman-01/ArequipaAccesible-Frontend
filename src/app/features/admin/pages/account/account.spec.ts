import { uiTestProviders } from '../../../../testing/ui-providers';
import { TestBed } from '@angular/core/testing';
import { AdminAccount } from './account';

describe('AdminAccount', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccount],
      providers: uiTestProviders(),
    }).compileComponents();
  });

  it('renders the administrative account page', () => {
    const fixture = TestBed.createComponent(AdminAccount);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Mi cuenta',
    );
  });
});
