import { Component, DestroyRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, mensajeError } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ReportAssignment } from '../../features/admin/pages/reports/report-assignment';
import { ReportPriority } from '../../features/admin/pages/priorities/report-priority';
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
  imports: [DatePipe, FormsModule, RouterLink, ReportPriority, ReportAssignment],
  templateUrl: './report-detail.html',
})
export class ReportDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
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
  private solicitud = 0;
  private catalogos: Catalogo[][] = [];
  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      this.solicitud++;
      this.report.set(null);
      this.history.set([]);
      this.notice.set('');
      this.clearImages();
      if (!Number.isSafeInteger(id) || id <= 0) {
        this.busy.set(false);
        this.error.set('Identificador de reporte inválido.');
        return;
      }
      void this.load(id);
    });
  }
  nombre(id: number, index: number) {
    return this.catalogos[index]?.find((c) => c.id === id)?.nombre ?? String(id);
  }
  private async load(id: number) {
    const solicitud = ++this.solicitud;
    this.busy.set(true);
    this.error.set('');
    this.photosError.set('');
    try {
      const [r, h, c] = await Promise.all([
        this.api.detalle(id),
        this.api.historial(id),
        this.api.catalogos(),
      ]);
      if (solicitud !== this.solicitud) return;
      this.report.set(r);
      this.history.set(h);
      this.catalogos = c;
      this.clearImages();
      for (const foto of r.fotos) {
        try {
          const blob = await this.api.foto(id, foto.id);
          if (solicitud !== this.solicitud) return;
          this.images.update((images) => [
              ...images,
              { id: foto.id, url: URL.createObjectURL(blob) },
            ]);
        } catch (error) {
          if (solicitud === this.solicitud) this.photosError.set(mensajeError(error));
        }
      }
    } catch (error) {
      if (solicitud !== this.solicitud) return;
      this.error.set(mensajeError(error));
      this.report.set(null);
    } finally {
      if (solicitud === this.solicitud) this.busy.set(false);
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
      if (this.report()?.id !== r.id) return;
      this.nuevoEstado = '';
      this.motivo = '';
      await this.load(r.id);
      if (this.report()?.id === r.id) this.notice.set('Estado actualizado e historial guardado.');
    } catch (error) {
      if (this.report()?.id !== r.id) return;
      const message = mensajeError(error);
      await this.load(r.id);
      if (this.report()?.id === r.id) this.error.set(message);
    } finally {
      if (this.report()?.id === r.id) this.busy.set(false);
    }
  }
  async actualizarAsignacion() {
    const reporte = this.report();
    if (!reporte) return;
    await this.load(reporte.id);
    if (this.report()?.id === reporte.id) this.notice.set('Reporte asignado e historial actualizado.');
  }

  async cambiarPublicacion(publicada: boolean) {
    const reporte = this.report();
    if (!reporte?.puedeCambiarPublicacion || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.notice.set('');
    try {
      await this.api.cambiarPublicacion(reporte.id, publicada);
      if (this.report()?.id !== reporte.id) return;
      this.report.set({ ...reporte, publicadoEnMapa: publicada });
      this.notice.set(publicada ? 'Reporte visible en el mapa público.' : 'Reporte retirado del mapa público.');
    } catch (error) {
      if (this.report()?.id === reporte.id) this.error.set(mensajeError(error));
    } finally {
      if (this.report()?.id === reporte.id) this.busy.set(false);
    }
  }

  private clearImages() {
    for (const image of this.images()) URL.revokeObjectURL(image.url);
    this.images.set([]);
  }
  ngOnDestroy() {
    this.solicitud++;
    this.clearImages();
  }
}
