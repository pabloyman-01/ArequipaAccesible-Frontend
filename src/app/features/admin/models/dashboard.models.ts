export type KpiTone = 'default' | 'attention' | 'success' | 'critical';

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  detail: string;
  detailSuffix?: string;
  icon: string;
  tone: KpiTone;
  indicatorIcon?: string;
  pulse?: boolean;
}

export type MapPinTone = 'primary' | 'secondary' | 'tertiary';
export type MapPinSize = 'lg' | 'md' | 'sm';

export interface MapPin {
  id: string;
  name: string;
  count: number;
  icon: string;
  tone: MapPinTone;
  size: MapPinSize;
  latitude: number;
  longitude: number;
  pulse?: boolean;
}

export interface MapSummary {
  activeCrews: number;
  gpsConnected: boolean;
  densestZone: string;
  averageArrival: string;
}

export type ReportSeverity = 'critical' | 'high' | 'risk';

export interface UrgentReport {
  id: string;
  title: string;
  description: string;
  time: string;
  district: string;
  severity: ReportSeverity;
}

export type BarrierTone = 'primary' | 'secondary' | 'tertiary';

export interface BarrierDistributionItem {
  id: string;
  label: string;
  percentage: number;
  count: number;
  icon: string;
  tone: BarrierTone;
}

export interface ComplianceMetric {
  label: string;
  value: string;
}

export interface ComplianceSummary {
  status: string;
  description: string;
  metrics: ComplianceMetric[];
}

export interface DashboardData {
  kpis: DashboardKpi[];
  mapPins: MapPin[];
  mapSummary: MapSummary;
  urgentReports: UrgentReport[];
  barriers: BarrierDistributionItem[];
  compliance: ComplianceSummary;
}
