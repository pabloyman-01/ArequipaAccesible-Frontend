import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from './runtime-config.service';

describe('Supabase public registration settings', () => {
  it('uses the current server confirmation mode with the publishable key only', async () => {
    const config = TestBed.inject(RuntimeConfigService);
    config.value = {
      apiBaseUrl: '/api',
      supabaseUrl: 'https://identity.example.test',
      supabasePublishableKey: 'sb_publishable_fixture',
    };
    const request = spyOn(window, 'fetch').and.resolveTo(
      Response.json({ mailer_autoconfirm: true }),
    );
    expect(await config.emailConfirmationRequired()).toBeFalse();
    expect(request.calls.mostRecent().args[0]).toBe(
      'https://identity.example.test/auth/v1/settings',
    );
    expect(request.calls.mostRecent().args[1]?.headers).toEqual({
      apikey: 'sb_publishable_fixture',
    });
    request.and.resolveTo(Response.json({ mailer_autoconfirm: false }));
    expect(await config.emailConfirmationRequired()).toBeTrue();
  });
  it('does not guess a mode when settings fail or are absent', async () => {
    const config = TestBed.inject(RuntimeConfigService);
    const request = spyOn(window, 'fetch').and.resolveTo(Response.json({}, { status: 503 }));
    await expectAsync(config.emailConfirmationRequired()).toBeRejected();
    request.and.resolveTo(Response.json({}));
    await expectAsync(config.emailConfirmationRequired()).toBeRejected();
  });
});
