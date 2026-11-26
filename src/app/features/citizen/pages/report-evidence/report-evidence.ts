import { ApiService, mensajeError, SugerenciaBarrera } from '../../../../core/api.service';
import { Catalogo } from '../../../../core/api.models';
import { ReportDraftService } from '../../../../core/report-draft.service';
import {
  AfterViewInit,
  OnInit,
  inject,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-report-evidence',
  imports: [RouterLink],
  templateUrl: './report-evidence.html',
})
export class ReportEvidence implements OnInit, AfterViewInit, OnDestroy {
  readonly draft = inject(ReportDraftService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  distritos: Catalogo[] = [];
  protected readonly tipoNombre = signal('');
  protected readonly clasificacionDisponible = signal(false);
  protected readonly analizando = signal(false);
  protected readonly sugerencia = signal<SugerenciaBarrera | null>(null);
  protected readonly mensajeSugerencia = signal('');
  private solicitudSugerencia = 0;
  private destroyed = false;
  readonly error = signal('');
  protected readonly address = this.draft.direccion;
  async ngOnInit() {
    if (!this.draft.hasClassification()) {
      void this.router.navigateByUrl('/ciudadano/nuevo-reporte');
      return;
    }
    try {
      const [distritos, tipos] = await this.api.catalogos();
      if (this.destroyed) return;
      this.distritos = distritos;
      this.tipoNombre.set(tipos.find((tipo) => tipo.id === this.draft.tipoBarreraId())?.nombre ?? '');
    } catch (error) {
      this.error.set(mensajeError(error));
    }
    if (this.destroyed) return;
    if (this.draft.foto()) this.setPhoto(this.draft.foto()!, this.draft.nombreFoto());
    try {
      const estado = await this.api.disponibilidadClasificacion();
      if (!this.destroyed) this.clasificacionDisponible.set(estado.disponible);
    } catch {
      this.clasificacionDisponible.set(false);
    }
  }
  protected continue() {
    if (!this.draft.ready()) {
      this.error.set(
        'Adjunta una foto JPEG/PNG, selecciona la ubicación en el mapa, el distrito y escribe una referencia.',
      );
      return;
    }
    void this.router.navigateByUrl('/ciudadano/nuevo-reporte/descripcion');
  }

  protected readonly photoName = signal('');
  protected readonly photoPreview = signal<string | null>(null);
  protected readonly photoError = signal('');
  protected readonly cameraStream = signal<MediaStream | null>(null);
  protected readonly isLocating = signal(false);
  protected readonly locationError = signal('');
  @ViewChild('locationMap', { static: true }) private readonly mapElement!: ElementRef<HTMLElement>;

  private map?: L.Map;
  private locationMarker?: L.Marker;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, { zoomControl: true }).setView(
      [-16.3989, -71.535],
      16,
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    if (this.draft.ubicacion()) this.setLocation(this.draft.ubicacion()!, false);
    this.map.on('click', (event: L.LeafletMouseEvent) => this.setLocation(event.latlng));
    requestAnimationFrame(() => this.map?.invalidateSize({ animate: false, pan: false }));
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.solicitudSugerencia++;
    this.closeCamera();
    this.revokePreview();
    this.map?.remove();
    this.map = undefined;
  }

  protected async startCamera(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.photoError.set('Tu navegador no permite acceder a la cámara. Puedes subir una foto.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      if (this.destroyed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      this.closeCamera();
      this.cameraStream.set(stream);
      this.photoError.set('');
    } catch {
      this.photoError.set('No se pudo acceder a la cámara. Revisa los permisos del navegador.');
    }
  }

  protected capturePhoto(video: HTMLVideoElement): void {
    if (!video.videoWidth || !video.videoHeight) {
      this.photoError.set('La cámara todavía no está lista. Inténtalo nuevamente.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (photo) => {
        if (this.destroyed) return;
        if (!photo) {
          this.photoError.set('No se pudo capturar la fotografía. Inténtalo nuevamente.');
          return;
        }

        this.setPhoto(photo, `evidencia-${Date.now()}.jpg`);
        this.closeCamera();
      },
      'image/jpeg',
      0.9,
    );
  }

  protected closeCamera(): void {
    this.cameraStream()
      ?.getTracks()
      .forEach((track) => track.stop());
    this.cameraStream.set(null);
  }

  protected useMapCenter(): void {
    if (!this.map) return;
    this.setLocation(this.map.getCenter());
    this.locationError.set('');
  }

  protected useCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set('Tu navegador no permite obtener la ubicación actual.');
      return;
    }

    this.isLocating.set(true);
    this.locationError.set('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = { lat: coords.latitude, lng: coords.longitude };
        this.setLocation(location);
        this.map?.setView(location, 17);
        this.isLocating.set(false);
      },
      () => {
        this.locationError.set(
          'No se pudo obtener tu ubicación. Revisa los permisos o marca el punto en el mapa.',
        );
        this.isLocating.set(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  protected selectPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    this.setPhoto(file, file.name);
  }

  private setPhoto(photo: Blob, name: string): void {
    if (!['image/jpeg', 'image/png'].includes(photo.type)) {
      this.photoError.set('Selecciona una fotografía JPEG o PNG válida.');
      return;
    }

    if (photo.size > 5 * 1024 * 1024) {
      this.photoError.set('La fotografía no puede superar los 5 MiB.');
      return;
    }

    this.revokePreview();
    this.limpiarSugerencia();
    this.draft.foto.set(photo);
    this.draft.nombreFoto.set(name);
    this.photoName.set(name);
    this.photoPreview.set(URL.createObjectURL(photo));
    this.photoError.set('');
  }

  protected async analizarFoto(): Promise<void> {
    const foto = this.draft.foto();
    if (!foto || this.analizando()) return;
    const solicitud = ++this.solicitudSugerencia;
    this.analizando.set(true);
    this.sugerencia.set(null);
    this.mensajeSugerencia.set('');
    try {
      const tipo = await this.api.sugerirBarrera(foto, this.draft.nombreFoto());
      if (solicitud !== this.solicitudSugerencia) return;
      this.sugerencia.set(tipo);
      if (!tipo) this.mensajeSugerencia.set('No hay una sugerencia para esta foto. Puedes continuar con tu selección.');
    } catch (error) {
      if (solicitud === this.solicitudSugerencia) this.mensajeSugerencia.set(mensajeError(error));
    } finally {
      if (solicitud === this.solicitudSugerencia) this.analizando.set(false);
    }
  }

  protected resolverSugerencia(aceptar: boolean): void {
    const tipo = this.sugerencia();
    if (!tipo) return;
    if (aceptar) {
      this.draft.tipoBarreraId.set(tipo.tipoBarreraId);
      this.tipoNombre.set(tipo.nombre);
    }
    this.sugerencia.set(null);
  }

  private limpiarSugerencia(): void {
    this.solicitudSugerencia++;
    this.analizando.set(false);
    this.sugerencia.set(null);
    this.mensajeSugerencia.set('');
  }

  protected removePhoto(): void {
    this.limpiarSugerencia();
    this.revokePreview();
    this.draft.foto.set(null);
    this.draft.nombreFoto.set('');
    this.photoName.set('');
    this.photoError.set('');
  }

  private revokePreview(): void {
    const preview = this.photoPreview();
    if (preview) {
      URL.revokeObjectURL(preview);
      this.photoPreview.set(null);
    }
  }

  private setLocation(location: L.LatLngLiteral, updateAddress = true): void {
    if (!this.map) {
      return;
    }

    const icon = L.divIcon({
      className: 'report-location-marker',
      html: '<span class="material-symbols-outlined">location_on</span>',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    if (this.locationMarker) {
      this.locationMarker.setLatLng(location);
    } else {
      this.locationMarker = L.marker(location, { draggable: true, icon }).addTo(this.map);
      this.locationMarker.on('dragend', () => this.setLocation(this.locationMarker!.getLatLng()));
    }

    if (updateAddress)
      this.draft.ubicacion.set({
        lat: Number(location.lat.toFixed(7)),
        lng: Number(location.lng.toFixed(7)),
      });
  }
}
