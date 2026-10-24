import { Injectable } from '@angular/core';

export interface RuntimeConfig {
  apiBaseUrl: string;
  supabaseUrl: string;
  supabasePublishableKey: string;
}
@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  value: RuntimeConfig = { apiBaseUrl: '/api', supabaseUrl: '', supabasePublishableKey: '' };
  async load(): Promise<void> {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Falta configurar config.json. Consulta el README.');
    const config = (await response.json()) as RuntimeConfig;
    if (
      !config.supabasePublishableKey?.startsWith('sb_publishable_') ||
      !/^https:\/\//.test(config.supabaseUrl)
    )
      throw new Error('Configura la URL real y la clave publicable de Supabase.');
    const api = new URL(config.apiBaseUrl, location.origin);
    if (
      !['http:', 'https:'].includes(api.protocol) ||
      api.username ||
      api.password ||
      api.search ||
      api.hash ||
      api.pathname === '/'
    )
      throw new Error('URL de API inválida.');
    this.value = { ...config, apiBaseUrl: config.apiBaseUrl.replace(/\/$/, '') };
  }
  isApiRequest(url: string): boolean {
    const base = new URL(this.value.apiBaseUrl, location.origin);
    const target = new URL(url, location.origin);
    return (
      target.origin === base.origin &&
      (target.pathname === base.pathname || target.pathname.startsWith(base.pathname + '/'))
    );
  }
  async emailConfirmationRequired(): Promise<boolean> {
    const response = await fetch(this.value.supabaseUrl + '/auth/v1/settings', {
      headers: { apikey: this.value.supabasePublishableKey },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new Error('No se pudo consultar la configuración de registro de Supabase.');
    const settings = await response.json();
    if (typeof settings.mailer_autoconfirm !== 'boolean')
      throw new Error('Supabase no informó la configuración de confirmación de correo.');
    return !settings.mailer_autoconfirm;
  }
}
