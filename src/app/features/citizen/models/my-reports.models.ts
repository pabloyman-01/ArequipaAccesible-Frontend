export type MyReportStatus = 'evaluation' | 'scheduled' | 'work' | 'resolved';

export interface MyReportMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'primary' | 'tertiary' | 'secondary' | 'neutral';
}

export interface MyReport {
  key: string;
  id: string;
  date: string;
  title: string;
  location: string;
  image: string;
  imageAlt: string;
  severity: string;
  severityTone: 'critical' | 'moderate';
  status: MyReportStatus;
  phase: string;
  progress: number;
  deadline: string;
  assignment: string;
  responsible: string;
  evidence: string;
  resolvedNote?: string;
  certificate?: string;
}
