import { Component, input, model } from '@angular/core';
import { ReportStatus } from '../../models/report.models';

@Component({
  selector: 'app-reports-filters',
  templateUrl: './reports-filters.html',
})
export class ReportsFilters {
  readonly search = model('');
  readonly district = model('');
  readonly barrierType = model('');
  readonly status = model<ReportStatus | ''>('');
  readonly total = input.required<number>();

  protected readonly districtOptions = [
    { value: '', label: 'Todos los Distritos' },
    { value: 'cercado', label: 'Cercado de Arequipa' },
    { value: 'yanahuara', label: 'Yanahuara' },
    { value: 'cayma', label: 'Cayma' },
    { value: 'paucarpata', label: 'Paucarpata' },
    { value: 'jose-luis', label: 'J.L. Bustamante y Rivero' },
  ];

  protected readonly barrierOptions = [
    { value: '', label: 'Tipo de Barrera' },
    { value: 'rampa', label: 'Rampa deteriorada / ausente' },
    { value: 'pasamanos', label: 'Falta de pasamanos' },
    { value: 'vereda', label: 'Vereda obstruida por desmonte' },
    { value: 'senaletica', label: 'Semáforo sonoro averiado' },
  ];

  protected readonly statusOptions: { value: ReportStatus | ''; label: string }[] = [
    { value: '', label: 'Todos los Estados' },
    { value: 'recibido', label: 'Recibido' },
    { value: 'en-proceso', label: 'En Proceso' },
    { value: 'atendido', label: 'Atendido' },
    { value: 'rechazado', label: 'Rechazado' },
  ];
}
