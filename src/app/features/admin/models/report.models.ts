export type ReportStatus = 'recibido' | 'en-proceso' | 'atendido' | 'rechazado';

export type ReportBarrierType =
  | 'rampa'
  | 'pasamanos'
  | 'vereda'
  | 'senaletica'
  | 'otro';

export type ReportBarrierTone = 'secondary' | 'error' | 'tertiary' | 'neutral';

export type ReportSecondaryAction = 'assign' | 'document' | 'info';

export interface ReportCitizen {
  name: string;
  initials: string;
}

export interface ReportLocation {
  address: string;
  district: string;
  districtKey: string;
  image: string;
  alt: string;
}

export interface ReportRow {
  key: string;
  id: string;
  urgency: string;
  date: string;
  citizen: ReportCitizen;
  barrier: string;
  barrierType: ReportBarrierType;
  barrierTone: ReportBarrierTone;
  location: ReportLocation;
  status: ReportStatus;
  secondaryAction: ReportSecondaryAction;
}

export interface ReportFilters {
  search: string;
  district: string;
  barrierType: string;
  status: string;
}
