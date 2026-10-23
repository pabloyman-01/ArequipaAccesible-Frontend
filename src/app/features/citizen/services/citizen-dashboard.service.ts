import { Injectable } from '@angular/core';
import { CitizenMetric, CitizenReport } from '../models/citizen.models';

@Injectable({ providedIn: 'root' })
export class CitizenDashboardService {
  readonly metrics: CitizenMetric[] = [
    {
      id: 'active',
      label: 'Reportes Activos',
      value: '3',
      detail: '2 en intervención municipal',
      icon: 'pending_actions',
      tone: 'primary',
    },
    {
      id: 'resolved',
      label: 'Resueltos / Reparados',
      value: '1',
      detail: 'Vía peatonal nivelada',
      icon: 'task_alt',
      tone: 'secondary',
    },
    {
      id: 'average-time',
      label: 'Tiempo Promedio',
      value: '48 hrs',
      detail: 'Cuadrillas activas en Cercado',
      icon: 'timer',
      tone: 'tertiary',
    },
  ];

  readonly reports: CitizenReport[] = [
    {
      key: 'citizen-report-1',
      id: 'ARQ-2023-089',
      date: '24 Oct 2023',
      title: 'Rampa peatonal con desnivel crítico de 8cm',
      location: 'Calle San Francisco 312, Cercado de Arequipa',
      image: 'images/citizen/report-ramp.png',
      imageAlt: 'Vereda de sillar agrietada en Calle San Francisco, Arequipa',
      status: 'en-proceso',
      progress: 50,
      progressDetail: 'Fase 2 de 4: Nivelación de sillar',
      delivery: 'Entrega: Mañana 16:00',
      actionLabel: 'Ver Detalle',
    },
    {
      key: 'citizen-report-2',
      id: 'ARQ-2023-042',
      date: '15 Sep 2023',
      title: 'Vereda con escombros y desmonte de obra',
      location: 'Av. Bolognesi cruce con Calle Grau, Yanahuara',
      image: 'images/citizen/report-sidewalk.png',
      imageAlt: 'Vereda reparada en Yanahuara, Arequipa',
      status: 'atendido',
      progress: 100,
      progressDetail: 'Completado • Certificado OMAPED',
      delivery: 'Calificación del ciudadano',
      actionLabel: 'Ver Acta',
      rating: 5,
    },
    {
      key: 'citizen-report-3',
      id: 'ARQ-2023-011',
      date: '02 Ago 2023',
      title: 'Semáforo acústico con volumen inaudible',
      location: 'Calle Lima / Av. Pumacahua, Cerro Colorado',
      fallbackIcon: 'volume_off',
      status: 'evaluacion',
      progress: 25,
      progressDetail: 'Subgerencia de Semaforización',
      delivery: 'En programación',
      actionLabel: 'Seguimiento',
    },
    {
      key: 'citizen-report-4',
      id: 'ARQ-2023-097',
      date: '20 Oct 2023',
      title: 'Pasaje peatonal sin superficie podotáctil',
      location: 'Av. Parra 214, Cercado de Arequipa',
      fallbackIcon: 'accessible_forward',
      status: 'en-proceso',
      progress: 30,
      progressDetail: 'Inspección de accesibilidad programada',
      delivery: 'Visita técnica: Viernes 10:00',
      actionLabel: 'Ver Detalle',
    },
  ];
}
