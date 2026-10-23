import { Component, input } from '@angular/core';
import {
  MapPin,
  MapPinSize,
  MapPinTone,
  MapSummary,
} from '../../models/dashboard.models';

const PIN_LABEL_CLASSES: Record<MapPinTone, string> = {
  primary:
    'mb-1 flex items-center gap-1 rounded-full border border-on-primary/30 bg-primary px-2.5 py-0.5 text-[11px] font-bold text-on-primary shadow-lg',
  secondary:
    'mb-1 flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-lowest px-2 py-0.5 text-[10px] font-bold text-primary shadow-md',
  tertiary:
    'mb-1 flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-lowest px-2 py-0.5 text-[10px] font-bold text-on-surface shadow-md',
};

const PIN_MARKER_TONE_CLASSES: Record<MapPinTone, string> = {
  primary: 'bg-primary/90 text-on-primary shadow-xl ring-4 ring-primary/20',
  secondary: 'bg-secondary-container text-on-secondary-container shadow-md',
  tertiary: 'bg-tertiary text-on-tertiary shadow-md',
};

const PIN_MARKER_SIZE_CLASSES: Record<MapPinSize, string> = {
  lg: 'h-9 w-9',
  md: 'h-7 w-7',
  sm: 'h-6 w-6',
};

const PIN_ICON_SIZE_CLASSES: Record<MapPinSize, string> = {
  lg: 'text-[20px]',
  md: 'text-[16px]',
  sm: 'text-[14px]',
};

@Component({
  selector: 'app-incident-map',
  host: { class: 'lg:col-span-7' },
  templateUrl: './incident-map.html',
})
export class IncidentMap {
  readonly pins = input.required<MapPin[]>();
  readonly summary = input.required<MapSummary>();

  protected pinLabelClass(tone: MapPinTone): string {
    return PIN_LABEL_CLASSES[tone];
  }

  protected pinMarkerClass(tone: MapPinTone, size: MapPinSize): string {
    return `${PIN_MARKER_TONE_CLASSES[tone]} ${PIN_MARKER_SIZE_CLASSES[size]}`;
  }

  protected pinIconClass(size: MapPinSize): string {
    return PIN_ICON_SIZE_CLASSES[size];
  }
}
