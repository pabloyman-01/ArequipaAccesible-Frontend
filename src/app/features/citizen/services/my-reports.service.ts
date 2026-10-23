import { Injectable } from '@angular/core';
import { MyReport, MyReportMetric } from '../models/my-reports.models';

@Injectable({ providedIn: 'root' })
export class MyReportsService {
  readonly totalRegistered = 16;

  readonly metrics: MyReportMetric[] = [
    { label: 'Total Reportados', value: '4', detail: 'reportes en registro', icon: 'folder_open', tone: 'primary' },
    { label: 'En Evaluación', value: '1', detail: 'Fase 1 (Evaluación)', icon: 'analytics', tone: 'tertiary' },
    { label: 'En Cuadrilla / Obra', value: '2', detail: 'Fases 2 y 3 activas', icon: 'engineering', tone: 'secondary' },
    { label: 'Resueltos y Conforme', value: '1', detail: 'Concluido', icon: 'task_alt', tone: 'neutral' },
  ];

  readonly reports: MyReport[] = [
    {
      key: 'my-report-1', id: 'ARQ-2023-095', date: '26 Oct 2023 (hace 4 horas)',
      title: 'Ausencia de vado peatonal y rampa en esquina concurrida',
      location: 'Calle Mercaderes 140, Cercado de Arequipa', image: 'images/citizen/history-01.png',
      imageAlt: 'Esquina peatonal de Calle Mercaderes sin rampa de acceso', severity: 'Severidad Crítica / Alta', severityTone: 'critical',
      status: 'evaluation', phase: 'Fase 1 de 4: Revisión técnica y asignación de cuadrilla municipal', progress: 25,
      deadline: 'Límite de dictamen: 48 hrs', assignment: 'Área: Gerencia de Desarrollo Urbano',
      responsible: 'Impacto Patrimonial: En Estudio Técnico', evidence: 'Geolocalización confirmada por GPS',
    },
    {
      key: 'my-report-2', id: 'ARQ-2023-089', date: '24 Oct 2023 (hace 2 días)',
      title: 'Rampa peatonal con desnivel crítico de 8cm (sillar fracturado)',
      location: 'Calle San Francisco 312, Cercado de Arequipa (frente a Convento)', image: 'images/citizen/history-02.png',
      imageAlt: 'Rampa de piedra sillar fracturada en Calle San Francisco', severity: 'Severidad Crítica / Alta', severityTone: 'critical',
      status: 'scheduled', phase: 'Fase 2 de 4: Nivelación y corte de sillar volcánico / Cuadrilla en camino', progress: 50,
      deadline: 'Estimado de llegada: Hoy 14:00', assignment: 'Cuadrilla Asignada: Equipo Centro Histórico #04',
      responsible: 'Responsable: Ing. M. Valdivia (OMAPED)', evidence: '3 fotos de evidencia adjuntadas',
    },
    {
      key: 'my-report-3', id: 'ARQ-2023-064', date: '21 Oct 2023 (hace 5 días)',
      title: 'Instalación de franja podotáctil y corrección de pendiente en esquina',
      location: 'Calle Santa Catalina con Ugarte, Cercado de Arequipa', image: 'images/citizen/history-03.png',
      imageAlt: 'Obra urbana de adecuación peatonal en Arequipa', severity: 'Severidad Alta', severityTone: 'critical',
      status: 'work', phase: 'Fase 3 de 4: Ejecución de rampa podotáctil y fraguado', progress: 75,
      deadline: 'Estimado de entrega: Mañana 18:00', assignment: 'Cuadrilla Asignada: Cuadrilla Integral Cercado #02',
      responsible: 'Responsable: Arq. D. Zúñiga (OMAPED)', evidence: '4 fotos de avance en obra',
    },
    {
      key: 'my-report-4', id: 'ARQ-2023-042', date: '15 Sep 2023 (hace 1 mes)',
      title: 'Vereda obstruida por desmonte y escombros de obra',
      location: 'Av. Bolognesi cruce con Calle Grau, Yanahuara', image: 'images/citizen/history-04.png',
      imageAlt: 'Vereda despejada y reparada en Yanahuara', severity: 'Severidad Moderada', severityTone: 'moderate',
      status: 'resolved', phase: 'Fase 4 de 4: Intervención finalizada y auditada', progress: 100,
      deadline: 'Finalizado y Conforme', assignment: 'Acta Oficial: Nº OMAPED-2023-0941',
      responsible: 'Cuadrilla Yanahuara Norte', evidence: '2 fotos de inspección final',
      resolvedNote: 'Atención finalizada: Obra ejecutada y validada según Norma Técnica Peruana de Accesibilidad A.120 y Ley N° 29973. Acta de conformidad municipal emitida y aprobada por OMAPED.',
      certificate: 'Descargar Certificado',
    },
  ];
}
