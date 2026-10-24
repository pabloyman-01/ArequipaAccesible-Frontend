import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import * as L from 'leaflet';
import { MapPin, MapPinTone, MapSummary } from '../../models/dashboard.models';

const PIN_COLORS: Record<MapPinTone, string> = {
  primary: '#7d1d1d',
  secondary: '#904d00',
  tertiary: '#00399c',
};

@Component({
  selector: 'app-incident-map',
  host: { class: 'lg:col-span-7' },
  templateUrl: './incident-map.html',
})
export class IncidentMap implements AfterViewInit, OnDestroy {
  readonly pins = input.required<MapPin[]>();
  readonly summary = input.required<MapSummary>();
  @ViewChild('map', { static: true }) private readonly mapElement!: ElementRef<HTMLElement>;

  private map?: L.Map;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, { zoomControl: false }).setView(
      [-16.3989, -71.535],
      13,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    for (const pin of this.pins()) {
      this.addMarker(pin);
    }

    // The dashboard grid finishes sizing after this hook; refresh Leaflet once it is visible.
    requestAnimationFrame(() => this.map?.invalidateSize({ animate: false, pan: false }));
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  protected zoomIn(): void {
    this.map?.zoomIn();
  }

  protected zoomOut(): void {
    this.map?.zoomOut();
  }

  private addMarker(pin: MapPin): void {
    const color = PIN_COLORS[pin.tone];
    const marker = L.marker([pin.latitude, pin.longitude], {
      icon: L.divIcon({
        className: 'incident-map-marker',
        html: `<span style="background:${color}">${pin.count}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
    }).addTo(this.map!);

    marker.bindPopup(
      `<strong>${pin.name}</strong><br>${pin.count} reportes georreferenciados`,
      { closeButton: false },
    );
  }
}
