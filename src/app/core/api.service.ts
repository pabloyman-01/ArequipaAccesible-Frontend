import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PUBLICA, RuntimeConfigService } from './runtime-config.service';
import {
  Catalogo,
  AvisoReporte,
  AreaMunicipal,
  AsignacionMunicipal,
  MapaPublico,
  DetalleReporte,
  DatosPrioridad,
  EvaluacionPrioridad,
  EventoReporte,
  Pagina,
  Perfil,
  Reporte,
  ResumenDashboard,
  EstadoReporte,
} from './api.models';

export interface SugerenciaBarrera { tipoBarreraId: number; nombre: string; }
export type Filtros = Record<string, string | number | null | undefined>;
export function correoLimitado(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'over_email_send_rate_limit',
  );
}
export function mensajeError(error: unknown): string {
  if (correoLimitado(error))
    return 'Supabase limitó temporalmente el envío de correos. Espera antes de solicitar otro enlace; si ya tienes contraseña, puedes iniciar sesión con ella.';
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'No se pudo conectar con el backend. Comprueba que esté activo.';
    if (error.status === 401) return 'Tu sesión caducó. Inicia sesión nuevamente.';
    if (error.status === 409 && error.error?.code === 'PERFIL_CONFLICTO')
      return 'No se pudo guardar el perfil: el documento o correo puede estar vinculado a una cuenta existente. Si ya te registraste, cierra sesión e ingresa con esa cuenta. Si los datos son correctos y el problema continúa, solicita ayuda.';
    if (error.status === 409)
      return 'Los datos cambiaron o ya están registrados. Recarga antes de volver a intentar.';
    if (error.status === 403)
      return 'Tu cuenta no tiene permiso para esta acción o está suspendida.';
    return error.error?.message || 'No se pudo completar la solicitud.';
  }
  return error instanceof Error ? error.message : 'No se pudo completar la solicitud.';
}
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(RuntimeConfigService);
  url(path: string) {
    return this.config.value.apiBaseUrl + path;
  }
  get<T>(path: string, filtros: Filtros = {}, publico = false): Promise<T> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filtros))
      if (value !== '' && value != null) params = params.set(key, String(value));
    const context = new HttpContext().set(API_PUBLICA, publico);
    return firstValueFrom(this.http.get<T>(this.url(path), { params, context }));
  }
  mapaPublico(filtros: Filtros) {
    return this.get<MapaPublico>('/publico/mapa', filtros, true);
  }
  avisos() {
    return this.get<AvisoReporte[]>('/reportes/avisos');
  }
  emitirAutorizacion() {
    return firstValueFrom(this.http.post<{ codigo: string; venceEn: string }>(this.url('/reportes/autorizaciones'), null));
  }
  revocarAutorizacion() {
    return firstValueFrom(this.http.delete<void>(this.url('/reportes/autorizaciones/activa')));
  }
  cambiarPublicacion(id: number, publicada: boolean) {
    return firstValueFrom(this.http.patch<void>(this.url('/reportes/' + id + '/publicacion'), { publicada }));
  }
  perfil() {
    return this.get<Perfil>('/usuarios/me');
  }
  guardarPerfil(datos: object, alta: boolean) {
    return firstValueFrom(
      alta
        ? this.http.put<Perfil>(this.url('/usuarios/me'), datos)
        : this.http.patch<Perfil>(this.url('/usuarios/me'), datos),
    );
  }
  catalogos() {
    return Promise.all([
      this.get<Catalogo[]>('/catalogos/distritos', {}, true),
      this.get<Catalogo[]>('/catalogos/tipos-barrera', {}, true),
    ]);
  }
  reportes(admin: boolean, filtros: Filtros) {
    return this.get<Pagina<Reporte>>(admin ? '/admin/reportes' : '/reportes', filtros);
  }
  detalle(id: number) {
    return this.get<DetalleReporte>('/reportes/' + id);
  }
  historial(id: number) {
    return this.get<EventoReporte[]>('/reportes/' + id + '/historial');
  }
  foto(id: number, foto: number) {
    return firstValueFrom(
      this.http.get(this.url(`/reportes/${id}/fotos/${foto}`), { responseType: 'blob' }),
    );
  }
  disponibilidadClasificacion() {
    return this.get<{ disponible: boolean }>('/reportes/ia');
  }
  sugerirBarrera(foto: Blob, nombre: string) {
    const form = new FormData();
    form.append('foto', foto, nombre);
    return firstValueFrom(this.http.post<SugerenciaBarrera | null>(this.url('/reportes/ia/sugerencia'), form));
  }
  crear(datos: object, foto: Blob, nombre: string) {
    const form = new FormData();
    form.append('datos', new Blob([JSON.stringify(datos)], { type: 'application/json' }));
    form.append('foto', foto, nombre);
    return firstValueFrom(
      this.http.post<{ id: number; codigo: string; estado: EstadoReporte }>(
        this.url('/reportes'),
        form,
      ),
    );
  }
  areasMunicipales() {
    return this.get<AreaMunicipal[]>('/admin/areas');
  }
  asignacionMunicipal(id: number) {
    return this.get<AsignacionMunicipal | null>(`/admin/reportes/${id}/asignacion`);
  }
  asignarReporte(id: number, areaId: number) {
    return firstValueFrom(this.http.post<AsignacionMunicipal>(this.url(`/admin/reportes/${id}/asignacion`), { areaId }));
  }
  prioridad(id: number) {
    return this.get<EvaluacionPrioridad>(`/admin/reportes/${id}/prioridad`);
  }
  guardarPrioridad(id: number, datos: DatosPrioridad) {
    return firstValueFrom(this.http.put<EvaluacionPrioridad>(this.url(`/admin/reportes/${id}/prioridad`), datos));
  }
  bandejaPrioridad() {
    return this.get<EvaluacionPrioridad[]>('/admin/prioridades');
  }
  cambiarReporte(
    id: number,
    estadoEsperado: EstadoReporte,
    nuevoEstado: EstadoReporte,
    motivo: string,
  ) {
    return firstValueFrom(
      this.http.patch(this.url(`/admin/reportes/${id}/estado`), {
        estadoEsperado,
        nuevoEstado,
        motivo: motivo.trim() || null,
      }),
    );
  }
  usuarios(filtros: Filtros) {
    return this.get<Pagina<Perfil>>('/admin/usuarios', filtros);
  }
  cambiarCuenta(id: string, estadoEsperado: string, nuevoEstado: string, motivo: string) {
    return firstValueFrom(
      this.http.patch(this.url(`/admin/usuarios/${id}/estado`), {
        estadoEsperado,
        nuevoEstado,
        motivo,
      }),
    );
  }
  resumen(filtros: Filtros = {}) {
    return this.get<ResumenDashboard>('/admin/dashboard/resumen', filtros);
  }
}
