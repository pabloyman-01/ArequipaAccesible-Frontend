import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService, AUTH_CLIENT_FACTORY } from './auth.service';
import { ApiService } from './api.service';
import { RuntimeConfigService } from './runtime-config.service';
import { roleGuard } from './auth.guard';
import { ReportDraftService } from './report-draft.service';

describe('Real session integration', () => {
  let service: AuthService,
    api: jasmine.SpyObj<ApiService>,
    sdk: any,
    callback: (event: string, session: any) => void;
  const session = {
    access_token: 'unit-test-token',
    user: { id: 'fixture-user', user_metadata: { roles: ['ADMINISTRADOR'] } },
  };
  const citizen = { id: 'fixture-user', roles: ['CIUDADANO'], estadoCuenta: 'ACTIVA' };
  beforeEach(async () => {
    sdk = jasmine.createSpyObj('SupabaseAuth', [
      'getSession',
      'initialize',
      'onAuthStateChange',
      'signInWithPassword',
      'signUp',
      'setSession',
      'signOut',
      'resetPasswordForEmail',
      'updateUser',
      'signInWithOtp',
    ]);
    sdk.initialize.and.resolveTo({ error: null });
    sdk.getSession.and.resolveTo({ data: { session }, error: null });
    sdk.onAuthStateChange.and.callFake((cb: any) => {
      callback = cb;
      return { data: { subscription: { unsubscribe() {} } } };
    });
    for (const method of [
      'signInWithPassword',
      'signOut',
      'resetPasswordForEmail',
      'updateUser',
      'signInWithOtp',
    ])
      sdk[method].and.resolveTo({ error: null });
    sdk.signUp.and.resolveTo({ data: { session: null }, error: null });
    sdk.setSession.and.resolveTo({ data: { session }, error: null });
    api = jasmine.createSpyObj('ApiService', ['perfil']);
    api.perfil.and.resolveTo(citizen as any);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: api },
        {
          provide: RuntimeConfigService,
          useValue: {
            load: async () => {},
            emailConfirmationRequired: async () => true,
            value: {
              supabaseUrl: 'https://identity.example.test',
              supabasePublishableKey: 'sb_publishable_fixture',
            },
          },
        },
        { provide: AUTH_CLIENT_FACTORY, useValue: async () => ({ auth: sdk }) },
      ],
    });
    service = TestBed.inject(AuthService);
    await service.initialize();
  });
  it('reports a failed callback initialization instead of silently returning to login', async () => {
    sdk.initialize.and.resolveTo({
      error: new Error('No se pudo intercambiar el código de acceso.'),
    });
    sdk.getSession.calls.reset();
    await service.initialize();
    expect(service.error()).toContain('intercambiar');
    expect(service.session()).toBeNull();
    expect(sdk.getSession).not.toHaveBeenCalled();
  });
  it('uses Java profile roles instead of editable Auth metadata', async () => {
    await service.login('fixture@example.test', 'fixture-password');
    expect(service.home()).toBe('/ciudadano');
    expect(service.profile()?.roles).toEqual(['CIUDADANO']);
  });
  it('routes a confirmed account without a profile to profile completion', async () => {
    api.perfil.and.rejectWith(new HttpErrorResponse({ status: 404 }));
    await service.refreshProfile();
    expect(service.home()).toBe('/inicio-sesion/completar-perfil');
  });
  it('does not treat backend failure or suspension as a missing profile', async () => {
    api.perfil.and.rejectWith(new HttpErrorResponse({ status: 403 }));
    await expectAsync(service.refreshProfile()).toBeRejected();
    expect(service.profile()).toBeNull();
  });
  it('requires the fresh administrator role for the administrative route', async () => {
    const guard = roleGuard('ADMINISTRADOR');
    const result = await TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(TestBed.inject(Router).serializeUrl(result as any)).toBe('/ciudadano');
    expect(api.perfil).toHaveBeenCalled();
  });
  it('handles a profile with all roles revoked without a redirect loop', async () => {
    api.perfil.and.resolveTo({ ...citizen, roles: [] } as any);
    const guard = roleGuard('CIUDADANO');
    const result = await TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(TestBed.inject(Router).serializeUrl(result as any)).toBe('/inicio-sesion');
    expect(service.home()).toBe('/inicio-sesion');
    expect(service.error()).toContain('rol habilitado');
  });
  it('does not announce password-login success when the profile has no roles', async () => {
    api.perfil.and.resolveTo({ ...citizen, roles: [] } as any);
    await expectAsync(
      service.login('fixture@example.test', 'fixture-password'),
    ).toBeRejectedWithError(/rol habilitado/);
  });
  it('detects password recovery and does not route to the dashboard', async () => {
    callback('PASSWORD_RECOVERY', session);
    const guard = roleGuard('ADMINISTRADOR');
    const result = await TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(TestBed.inject(Router).serializeUrl(result as any)).toBe(
      '/inicio-sesion/nueva-contrasena',
    );
  });
  it('sign-up waits for confirmation instead of inventing a profile or session', async () => {
    expect(await service.signup('fixture@example.test', 'fixture-password')).toBeNull();
    expect(api.perfil).not.toHaveBeenCalled();
    expect(sdk.signUp.calls.mostRecent().args[0].options.emailRedirectTo).toBe(location.origin);
  });
  it('adopts the real signup session when email confirmation is disabled', async () => {
    const config = TestBed.inject(RuntimeConfigService);
    spyOn(config, 'emailConfirmationRequired').and.resolveTo(false);
    sdk.signUp.and.resolveTo({
      data: { session: { ...session, refresh_token: 'fixture-refresh' } },
      error: null,
    });
    expect(await service.signup('fixture@example.test', 'fixture-password')).toEqual(
      session as any,
    );
    expect(sdk.setSession).toHaveBeenCalledWith({
      access_token: 'unit-test-token',
      refresh_token: 'fixture-refresh',
    });
    expect(service.session()).toEqual(session as any);
    expect(service.profile()).toBeNull();
  });
  it('does not register if the server confirmation setting cannot be read', async () => {
    const config = TestBed.inject(RuntimeConfigService);
    spyOn(config, 'emailConfirmationRequired').and.rejectWith(new Error('offline'));
    await expectAsync(service.signup('fixture@example.test', 'fixture-password')).toBeRejected();
    expect(sdk.signUp).not.toHaveBeenCalled();
  });
  it('does not repeat signup when adopting the immediate session fails', async () => {
    const config = TestBed.inject(RuntimeConfigService);
    spyOn(config, 'emailConfirmationRequired').and.resolveTo(false);
    sdk.signUp.and.resolveTo({
      data: { session: { ...session, refresh_token: 'fixture-refresh' } },
      error: null,
    });
    sdk.setSession.and.resolveTo({ data: { session: null }, error: new Error('offline') });
    await expectAsync(
      service.signup('fixture@example.test', 'fixture-password'),
    ).toBeRejectedWithError(/cuenta fue creada/);
    expect(sdk.signUp).toHaveBeenCalledTimes(1);
  });
  it('clears profile, private draft and browser session even if logout fails', async () => {
    spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    sdk.signOut.and.rejectWith(new Error('offline'));
    const draft = TestBed.inject(ReportDraftService);
    draft.descripcion.set('Private test draft');
    localStorage.setItem('arequipa-auth-session', 'fixture');
    await service.signOut().catch(() => {});
    expect(service.session()).toBeNull();
    expect(service.profile()).toBeNull();
    expect(draft.descripcion()).toBe('');
    expect(localStorage.getItem('arequipa-auth-session')).toBeNull();
  });
  it('clears the previous user draft when the signed-in identity changes', () => {
    const draft = TestBed.inject(ReportDraftService);
    draft.descripcion.set('Previous user draft');
    callback('SIGNED_IN', { ...session, user: { id: 'another-fixture' } });
    expect(draft.descripcion()).toBe('');
    expect(service.profile()).toBeNull();
  });
});
