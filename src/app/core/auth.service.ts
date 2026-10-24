import { HttpErrorResponse } from '@angular/common/http';
import { InjectionToken, Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
export const AUTH_CLIENT_FACTORY = new InjectionToken<
  (url: string, key: string, flow?: 'pkce' | 'implicit') => Promise<SupabaseClient>
>('AUTH_CLIENT_FACTORY', {
  providedIn: 'root',
  factory:
    () =>
    async (url, key, flow = 'pkce') => {
      const { createClient } = await import('@supabase/supabase-js');
      // A non-persistent client is used only for password signup when the server auto-confirms.
      // Login links and recovery retain the existing PKCE client.
      if (flow === 'implicit')
        return createClient(url, key, {
          auth: {
            flowType: 'implicit',
            storageKey: 'arequipa-registration-' + crypto.randomUUID(),
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        });
      return createClient(url, key, {
        auth: {
          flowType: 'pkce',
          storageKey: 'arequipa-auth-session',
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    },
});
import { ApiService, mensajeError } from './api.service';
import { ReportDraftService } from './report-draft.service';
import { Perfil } from './api.models';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly config = inject(RuntimeConfigService);
  private readonly createClient = inject(AUTH_CLIENT_FACTORY);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly session = signal<Session | null>(null);
  readonly profile = signal<Perfil | null>(null);
  readonly error = signal('');
  readonly recovery = signal(false);
  private client?: SupabaseClient;
  private readonly draft = inject(ReportDraftService);
  async initialize() {
    const callbackUrl = new URL(location.href);
    const hasCode = callbackUrl.searchParams.has('code');
    const hasCallbackError = callbackUrl.searchParams.has('error');
    try {
      await this.config.load();
      const c = this.config.value;
      this.client = await this.createClient(c.supabaseUrl, c.supabasePublishableKey);
      // Never await another Auth operation from this callback: the SDK holds its session lock.
      this.client.auth.onAuthStateChange((event, session) => {
        if (this.session()?.user.id && this.session()?.user.id !== session?.user.id) {
          this.draft.clear();
          this.profile.set(null);
        }
        this.session.set(session);
        if (event === 'PASSWORD_RECOVERY') this.recovery.set(true);
        if (event === 'SIGNED_OUT') {
          this.draft.clear();
          this.profile.set(null);
          void this.router.navigateByUrl('/inicio-sesion');
        }
      });
      const initialized = await this.client.auth.initialize();
      if (initialized.error) throw initialized.error;
      const { data, error } = await this.client.auth.getSession();
      if (error) throw error;
      this.session.set(data.session);
      if (hasCallbackError || (hasCode && !data.session)) {
        throw new Error(
          'No se pudo recuperar la sesión del enlace. Solicita uno nuevo desde este navegador y ábrelo aquí.',
        );
      }
      // Auth.getSession supplies tokens; only the Java API decides roles and account permissions.
    } catch (error) {
      this.session.set(null);
      this.profile.set(null);
      this.error.set(mensajeError(error));
    } finally {
      // Authorization codes must not remain in the address bar, even after a failed exchange.
      if (hasCode || hasCallbackError) {
        const url = new URL(location.href);
        for (const name of ['code', 'error', 'error_code', 'error_description'])
          url.searchParams.delete(name);
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    }
  }
  private auth() {
    if (!this.client) throw new Error(this.error() || 'Autenticación no configurada.');
    return this.client.auth;
  }
  async token() {
    if (!this.session()) return undefined;
    const { data, error } = await this.auth().getSession();
    if (error) throw error;
    this.session.set(data.session);
    return data.session?.access_token;
  }
  async refreshProfile() {
    try {
      const p = await this.api.perfil();
      this.profile.set(p);
      return p;
    } catch (error) {
      this.profile.set(null);
      if (error instanceof HttpErrorResponse && error.status === 404) return null;
      throw error;
    }
  }
  async login(email: string, password: string) {
    const { error } = await this.auth().signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await this.refreshProfile();
    if (profile && !profile.roles.length)
      throw new Error(
        'Tu cuenta no tiene un rol habilitado. Contacta al responsable del proyecto.',
      );
  }
  async loginWithLink(email: string) {
    const { error } = await this.auth().signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: location.origin },
    });
    if (error) throw error;
  }
  async signup(email: string, password: string) {
    const confirmationRequired = await this.config.emailConfirmationRequired();
    const config = this.config.value;
    const registrationAuth = confirmationRequired
      ? this.auth()
      : (await this.createClient(config.supabaseUrl, config.supabasePublishableKey, 'implicit'))
          .auth;
    const { data, error } = await registrationAuth.signUp({
      email,
      password,
      options: { emailRedirectTo: location.origin },
    });
    if (error) throw error;
    if (data.session && !confirmationRequired) {
      const adopted = await this.auth().setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      if (adopted.error || !adopted.data.session)
        throw new Error(
          'La cuenta fue creada. Inicia sesión con tu correo y contraseña para continuar.',
        );
      this.profile.set(null);
      this.session.set(adopted.data.session);
      return adopted.data.session;
    }
    return data.session;
  }
  async requestRecovery(email: string) {
    const { error } = await this.auth().resetPasswordForEmail(email, {
      redirectTo: location.origin,
    });
    if (error) throw error;
  }
  async updatePassword(password: string) {
    const { error } = await this.auth().updateUser({ password });
    if (error) throw error;
    this.recovery.set(false);
  }
  home() {
    return !this.profile()
      ? '/inicio-sesion/completar-perfil'
      : this.profile()!.roles.includes('ADMINISTRADOR')
        ? '/'
        : this.profile()!.roles.includes('CIUDADANO')
          ? '/ciudadano'
          : '/inicio-sesion';
  }
  async signOut() {
    // A local logout always removes this browser session, even when the network is unavailable.
    try {
      await this.auth().signOut({ scope: 'local' });
    } catch {
      /* Local cleanup must work offline. */
    } finally {
      this.session.set(null);
      this.profile.set(null);
      this.draft.clear();
      for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem('arequipa-auth-session');
        storage.removeItem('arequipa-auth-session-code-verifier');
      }
      void this.router.navigateByUrl('/inicio-sesion');
    }
  }
}
