import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BarrierOption, SeverityOption } from '../../models/new-report.models';

@Component({
  selector: 'app-new-report',
  imports: [RouterLink],
  templateUrl: './new-report.html',
})
export class NewReport {
  protected readonly selectedBarrier = signal('rampa-rota');
  protected readonly selectedSeverity = signal('critica');

  protected readonly barriers: BarrierOption[] = [
    {
      key: 'rampa-rota',
      title: 'Rampa Rota o Inexistente',
      description: 'No hay rampa en la esquina o está quebrada y las sillas de ruedas no pueden subir.',
      code: 'B-01',
      icon: 'accessible',
    },
    {
      key: 'desmonte',
      title: 'Vereda con Desmonte u Obstáculo',
      description: 'Tierra, piedras de obra, cables o basura que tapan el paso de los peatones.',
      code: 'B-04',
      icon: 'construction',
    },
    {
      key: 'semaforo-sonoro',
      title: 'Semáforo Sonoro Averiado',
      description: 'No suena ni vibra para avisar a personas ciegas cuándo cruzar seguros.',
      code: 'B-08',
      icon: 'traffic',
    },
    {
      key: 'escalon',
      title: 'Escalón sin Rampa de Acceso',
      description: 'Subida o grada alta en la vereda sin rampa alternativa para pasar con coche o silla.',
      code: 'B-02',
      icon: 'stairs',
    },
    {
      key: 'comercio',
      title: 'Comercio / Letrero en Vereda',
      description: 'Mesas, mercadería, toldos o carteles que invaden y reducen la vereda.',
      code: 'B-11',
      icon: 'storefront',
    },
    {
      key: 'adoquin',
      title: 'Deterioro de Adoquín / Laja',
      description: 'Huecos profundos, adoquines rotos o lajas de sillar sueltas donde la gente tropieza.',
      code: 'B-05',
      icon: 'grid_goldenratio',
    },
  ];

  protected readonly severities: SeverityOption[] = [
    {
      key: 'critica',
      badge: 'Prioridad Inmediata',
      title: 'Prioridad 1: Crítica / Alta',
      description:
        'Bloqueo total: Nadie en silla de ruedas o con bastón puede pasar y tienen que arriesgarse yendo por la pista con los autos.',
      response: 'Respuesta estimada: < 24 horas',
      icon: 'emergency',
      badgeClass: 'bg-error-container text-on-error-container',
    },
    {
      key: 'moderada',
      badge: 'Intervención Regular',
      title: 'Prioridad 2: Moderada',
      description:
        'Paso difícil: Se puede avanzar pero con mucho esfuerzo, peligro de caída o desviándose un poco.',
      response: 'Respuesta estimada: 48 - 72 horas',
      icon: 'schedule',
      badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
    },
    {
      key: 'preventiva',
      badge: 'Mantenimiento Urbano',
      title: 'Prioridad 3: Preventiva',
      description:
        'Desgaste inicial: La vereda o pintura se está dañando y conviene repararla antes de que empeore.',
      response: 'Programación quincenal',
      icon: 'event_note',
      badgeClass: 'bg-surface-container-highest text-on-surface-variant',
    },
  ];

  protected selectBarrier(key: string): void {
    this.selectedBarrier.set(key);
  }

  protected selectSeverity(key: string): void {
    this.selectedSeverity.set(key);
  }

  protected selectionClass(selected: boolean): string {
    return selected
      ? 'bg-surface-container-low shadow-sm ring-2 ring-primary-container'
      : 'bg-surface-container hover:bg-surface-container-high';
  }
}
