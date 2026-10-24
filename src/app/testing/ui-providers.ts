import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { ReportDraftService } from '../core/report-draft.service';

/** Explicit fixtures for component tests only. No production fallback dataset. */
export function uiTestProviders() {
  const api = jasmine.createSpyObj('ApiService', [
    'catalogos',
    'reportes',
    'perfil',
    'guardarPerfil',
    'detalle',
    'historial',
    'foto',
    'crear',
    'cambiarReporte',
    'usuarios',
    'cambiarCuenta',
    'resumen',
  ]);
  const page = { elementos: [], limite: 20, hayMas: false, siguienteCursor: null };
  api.catalogos.and.resolveTo([[], []]);
  api.reportes.and.resolveTo(page);
  api.usuarios.and.resolveTo(page);
  api.perfil.and.resolveTo(null);
  api.resumen.and.resolveTo({
    total: 0,
    pendientes: 0,
    atendidos: 0,
    rechazados: 0,
    porEstado: {},
    porSeveridadDeclarada: {},
    porTipoBarrera: [],
    porDistrito: [],
  });
  const auth = {
    profile: signal(null),
    session: signal(null),
    error: signal(''),
    recovery: signal(false),
    refreshProfile: jasmine.createSpy().and.resolveTo(null),
    signOut: jasmine.createSpy().and.resolveTo(undefined),
    login: jasmine.createSpy().and.resolveTo(undefined),
    signup: jasmine.createSpy().and.resolveTo(null),
    loginWithLink: jasmine.createSpy().and.resolveTo(undefined),
    requestRecovery: jasmine.createSpy().and.resolveTo(undefined),
    home: () => '/ciudadano',
  };
  const draft = new ReportDraftService();
  draft.tipoBarreraId.set(1);
  return [
    provideRouter([]),
    { provide: ApiService, useValue: api },
    { provide: AuthService, useValue: auth },
    { provide: ReportDraftService, useValue: draft },
  ];
}
