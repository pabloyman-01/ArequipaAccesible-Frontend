export type CitizenReportStatus = 'en-proceso' | 'atendido' | 'evaluacion';

export interface CitizenMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'primary' | 'secondary' | 'tertiary';
}

export interface CitizenReport {
  key: string;
  id: string;
  date: string;
  title: string;
  location: string;
  image?: string;
  imageAlt?: string;
  fallbackIcon?: string;
  status: CitizenReportStatus;
  progress: number;
  progressDetail: string;
  delivery: string;
  actionLabel: string;
  rating?: number;
}
