import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-report-evidence',
  imports: [RouterLink],
  templateUrl: './report-evidence.html',
})
export class ReportEvidence implements AfterViewInit, OnDestroy {
  protected readonly address = signal('Calle San Francisco 312, Cercado de Arequipa');
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

    this.setLocation({ lat: -16.3989, lng: -71.535 }, false);
    this.map.on('click', (event: L.LeafletMouseEvent) => this.setLocation(event.latlng));
    requestAnimationFrame(() => this.map?.invalidateSize({ animate: false, pan: false }));
  }

  ngOnDestroy(): void {
    this.closeCamera();
    this.revokePreview();
    this.map?.remove();
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
    canvas.toBlob((photo) => {
      if (!photo) {
        this.photoError.set('No se pudo capturar la fotografía. Inténtalo nuevamente.');
        return;
      }

      this.setPhoto(photo, `evidencia-${Date.now()}.jpg`);
      this.closeCamera();
    }, 'image/jpeg', 0.9);
  }

  protected closeCamera(): void {
    this.cameraStream()?.getTracks().forEach((track) => track.stop());
    this.cameraStream.set(null);
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
        this.locationError.set('No se pudo obtener tu ubicación. Revisa los permisos del navegador.');
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
    if (!photo.type.startsWith('image/')) {
      this.photoError.set('Selecciona un archivo de imagen válido.');
      return;
    }

    if (photo.size > 10 * 1024 * 1024) {
      this.photoError.set('La fotografía no puede superar los 10 MB.');
      return;
    }

    this.revokePreview();
    this.photoName.set(name);
    this.photoPreview.set(URL.createObjectURL(photo));
    this.photoError.set('');
  }

  protected removePhoto(): void {
    this.revokePreview();
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

    if (updateAddress) {
      this.address.set(`Ubicación seleccionada: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
    }
  }
}
