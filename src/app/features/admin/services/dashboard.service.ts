import { Injectable } from '@angular/core';
import { DashboardData } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  readonly data: DashboardData = {
    kpis: [
      {
        id: 'total-reports',
        label: 'Total Reportes',
        value: '1,248',
        detail: '+14%',
        detailSuffix: 'vs mes anterior',
        icon: 'folder_open',
        tone: 'default',
        indicatorIcon: 'trending_up',
      },
      {
        id: 'active-crews',
        label: 'En Atención / Cuadrillas',
        value: '38',
        detail: 'Cuadrillas activas en campo',
        icon: 'engineering',
        tone: 'attention',
        pulse: true,
      },
      {
        id: 'resolved',
        label: 'Resueltos este Mes',
        value: '1,085',
        detail: '87%',
        detailSuffix: 'tasa de resolución',
        icon: 'task_alt',
        tone: 'success',
      },
      {
        id: 'critical-points',
        label: 'Puntos Críticos',
        value: '12',
        detail: 'Bloqueo o riesgo inminente',
        icon: 'warning',
        tone: 'critical',
        pulse: true,
      },
    ],
    mapPins: [
      {
        id: 'cercado',
        name: 'Cercado',
        count: 22,
        icon: 'accessible_forward',
        tone: 'primary',
        size: 'lg',
        latitude: -16.3989,
        longitude: -71.535,
        pulse: true,
      },
      {
        id: 'yanahuara',
        name: 'Yanahuara',
        count: 9,
        icon: 'hearing',
        tone: 'secondary',
        size: 'md',
        latitude: -16.3907,
        longitude: -71.5431,
      },
      {
        id: 'cayma',
        name: 'Cayma',
        count: 6,
        icon: 'stairs',
        tone: 'tertiary',
        size: 'sm',
        latitude: -16.3458,
        longitude: -71.5674,
      },
    ],
    mapSummary: {
      activeCrews: 3,
      gpsConnected: true,
      densestZone: 'Centro Histórico (Cercado)',
      averageArrival: '24 min',
    },
    urgentReports: [
      {
        id: 'REP-2023-1402',
        title: 'Calle Mercaderes 314 • Rampa rota',
        description:
          'Desprendimiento de sillar de 8cm. Bloquea paso a sillas de ruedas.',
        time: 'Hace 35m',
        district: 'Cercado',
        severity: 'critical',
      },
      {
        id: 'REP-2023-1398',
        title: 'Av. Bolognesi / Puente Grau • Semáforo',
        description:
          'Dispositivo sonoro para invidentes inoperativo en cruce principal.',
        time: 'Hace 2h',
        district: 'Yanahuara',
        severity: 'high',
      },
      {
        id: 'REP-2023-1391',
        title: 'Av. Aviación km 4.5 • Desmonte de vereda',
        description:
          'Escombros en vía peatonal fuerzan paso por calzada vehicular.',
        time: 'Hace 3.5h',
        district: 'Cerro Colorado',
        severity: 'risk',
      },
    ],
    barriers: [
      {
        id: 'ramps',
        label: 'Rampas deterioradas o inexistentes',
        percentage: 42,
        count: 524,
        icon: 'accessible_forward',
        tone: 'primary',
      },
      {
        id: 'sidewalks',
        label: 'Veredas rotas / Desmonte de sillar',
        percentage: 28,
        count: 349,
        icon: 'personal_injury',
        tone: 'secondary',
      },
      {
        id: 'traffic-lights',
        label: 'Semáforos sonoros inoperativos',
        percentage: 16,
        count: 200,
        icon: 'hearing',
        tone: 'tertiary',
      },
    ],
    compliance: {
      status: '91.4% Conforme',
      description:
        'El Plan de Adecuación Progresiva del Centro Histórico mantiene 18 obras bajo supervisión directa con informe técnico para CONADIS.',
      metrics: [
        { label: 'Actas Visadas OMAPED', value: '142 de 156' },
        { label: 'Sanciones Evitadas', value: 'S/ 245,000' },
      ],
    },
  };
}
