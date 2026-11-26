import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { ApiService, mensajeError } from '../../core/api.service';
import { Catalogo, ESTADOS, EstadoReporte, PuntoMapa, etiquetaEstado } from '../../core/api.models';

const COLORES: Record<EstadoReporte, string> = {
  RECIBIDO: '#704524',
  EN_EVALUACION: '#864e00',
  ASIGNADO: '#564495',
  EN_PROCESO: '#1a588f',
  ATENDIDO: '#236240',
  RECHAZADO: '#8f2432',
};

@Component({
  selector: 'app-public-map',
  imports: [RouterLink, FormsModule],
  templateUrl: './public-map.html',
})
export class PublicMap implements AfterViewInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly element = viewChild.required<ElementRef<HTMLElement>>('map');
  private map?: L.Map;
  private markers?: L.LayerGroup;
  readonly puntos = signal<PuntoMapa[]>([]);
  readonly hayMas = signal(false);
  readonly tipos = signal<Catalogo[]>([]);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly estados = ESTADOS;
  readonly etiquetaEstado = etiquetaEstado;
  estado = '';
  tipo = '';

  ngAfterViewInit(): void {
    this.map = L.map(this.element().nativeElement).setView([-16.3989, -71.535], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.map);
    this.markers = L.layerGroup().addTo(this.map);
    queueMicrotask(() => void this.iniciar());
  }

  private async iniciar() {
    const [, result] = await Promise.allSettled([this.buscar(), this.api.catalogos()]);
    if (result.status === 'fulfilled' && this.map) this.tipos.set(result.value[1]);
  }

  async buscar() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const resultado = await this.api.mapaPublico({
        estado: this.estado,
        tipoBarreraId: this.tipo,
      });
      if (!this.markers) return;
      this.puntos.set(resultado.puntos);
      this.hayMas.set(resultado.hayMas);
      this.markers.clearLayers();
      for (const punto of resultado.puntos) {
        const color = COLORES[punto.estado];
        const popup = document.createElement('span');
        popup.textContent = `${punto.tipo} · ${etiquetaEstado(punto.estado)} · ${punto.cantidad}`;
        L.circleMarker([punto.latitud, punto.longitud], { radius: 8, color, fillOpacity: 0.75 })
          .bindPopup(popup)
          .addTo(this.markers);
      }
    } catch (error) {
      this.error.set(mensajeError(error));
      this.puntos.set([]);
      this.hayMas.set(false);
      this.markers?.clearLayers();
    } finally {
      this.busy.set(false);
    }
  }

  enfocar(punto: PuntoMapa): void {
    this.map?.setView([punto.latitud, punto.longitud], 16);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
    this.markers = undefined;
  }
}
