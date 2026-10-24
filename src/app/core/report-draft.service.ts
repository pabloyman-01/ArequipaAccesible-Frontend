import { Injectable, signal } from '@angular/core';
import { Severidad } from './api.models';

@Injectable({ providedIn: 'root' })
export class ReportDraftService {
  readonly tipoBarreraId = signal<number | null>(null);
  readonly severidad = signal<Severidad>('BAJA');
  readonly distritoId = signal<number | null>(null);
  readonly direccion = signal('');
  readonly descripcion = signal('');
  readonly ubicacion = signal<{ lat: number; lng: number } | null>(null);
  readonly foto = signal<Blob | null>(null);
  readonly nombreFoto = signal('');
  readonly uncertain = signal(false);
  clear() {
    this.tipoBarreraId.set(null);
    this.severidad.set('BAJA');
    this.distritoId.set(null);
    this.direccion.set('');
    this.descripcion.set('');
    this.ubicacion.set(null);
    this.foto.set(null);
    this.nombreFoto.set('');
    this.uncertain.set(false);
  }
  ready() {
    return (
      this.tipoBarreraId() != null &&
      this.distritoId() != null &&
      this.ubicacion() != null &&
      this.foto() != null &&
      Boolean(this.direccion().trim())
    );
  }
}
