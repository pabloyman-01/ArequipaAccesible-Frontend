import { Injectable, signal } from '@angular/core';
import { Severidad } from './api.models';

@Injectable({ providedIn: 'root' })
export class ReportDraftService {
  readonly tipoBarreraId = signal<number | null>(null);
  readonly severidad = signal<Severidad | null>(null);
  readonly distritoId = signal<number | null>(null);
  readonly direccion = signal('');
  readonly descripcion = signal('');
  readonly publicarEnMapa = signal(false);
  readonly codigoAutorizacion = signal('');
  readonly ubicacion = signal<{ lat: number; lng: number } | null>(null);
  readonly foto = signal<Blob | null>(null);
  readonly nombreFoto = signal('');
  readonly uncertain = signal(false);
  clear() {
    this.tipoBarreraId.set(null);
    this.severidad.set(null);
    this.distritoId.set(null);
    this.direccion.set('');
    this.descripcion.set('');
    this.publicarEnMapa.set(false);
    this.codigoAutorizacion.set('');
    this.ubicacion.set(null);
    this.foto.set(null);
    this.nombreFoto.set('');
    this.uncertain.set(false);
  }
  hasData() {
    return Boolean(
      this.tipoBarreraId() || this.severidad() || this.distritoId() || this.ubicacion() ||
      this.foto() || this.direccion().trim() || this.descripcion().trim() || this.codigoAutorizacion().trim()
    );
  }
  hasClassification() {
    return this.tipoBarreraId() !== null && this.severidad() !== null;
  }
  ready() {
    return (
      this.hasClassification() &&
      this.distritoId() != null &&
      this.ubicacion() != null &&
      this.foto() != null &&
      Boolean(this.direccion().trim())
    );
  }
}
