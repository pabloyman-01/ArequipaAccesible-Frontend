import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, mensajeError } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import {
  Catalogo,
  DetalleReporte,
  EventoReporte,
  EstadoReporte,
  SIGUIENTES,
  etiquetaEstado,
} from '../../core/api.models';

@Component({
  selector: 'app-report-detail',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './report-detail.html',
})
export class ReportDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly report = signal<DetalleReporte | null>(null);
  readonly history = signal<EventoReporte[]>([]);
  readonly images = signal<{ id: number; url: string }[]>([]);
  readonly error = signal('');
  readonly notice = signal('');
  readonly busy = signal(false);
  readonly photosError = signal('');
  readonly etiqueta = etiquetaEstado;
  readonly siguientes = SIGUIENTES;
  nuevoEstado: EstadoReporte | '' = '';
  motivo = '';
  private destroyed = false;
  private catalogos: Catalogo[][] = [];
  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.error.set('Identificador de reporte invÃ¡lido.');
      return;
    }
    await this.load(id);
  }
  nombre(id: number, index: number) {
    return this.catalogos[index]?.find((c) => c.id === id)?.nombre ?? String(id);
  }
  private async load(id: number) {
    this.busy.set(true);
    this.error.set('');
    this.photosError.set('');
    try {
      const [r, h, c] = await Promise.all([
        this.api.detalle(id),
        this.api.historial(id),
        this.api.catalogos(),
      ]);
      this.report.set(r);
      this.history.set(h);
      this.catalogos = c;
      this.clearImages();
      for (const foto of r.fotos) {
        try {
          const blob = await this.api.foto(id, foto.id);
          if (!this.destroyed)
            this.images.update((images) => [
              ...images,
              { id: foto.id, url: URL.createObjectURL(blob) },
            ]);
        } catch (error) {
          this.photosError.set(mensajeError(error));
        }
      }
    } catch (error) {
      this.error.set(mensajeError(error));
      this.report.set(null);
    } finally {
      this.busy.set(false);
    }
  }
  async change() {
    const r = this.report();
    if (!r || !this.nuevoEstado || this.busy()) return;
    if (this.nuevoEstado === 'RECHAZADO' && !this.motivo.trim()) {
      this.error.set('Indica el motivo del rechazo.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.notice.set('');
    try {
      await this.api.cambiarReporte(r.id, r.estado, this.nuevoEstado, this.motivo);
      this.nuevoEstado = '';
      this.motivo = '';
      await this.load(r.id);
      this.notice.set('Estado actualizado e historial guardado.');
    } catch (error) {
      const message = mensajeError(error);
      await this.load(r.id);
      this.error.set(message);
    } finally {
      this.busy.set(false);
    }
  }
  private clearImages() {
    for (const image of this.images()) URL.revokeObjectURL(image.url);
    this.images.set([]);
  }
  ngOnDestroy() {
    this.destroyed = true;
    this.clearImages();
  }
}
