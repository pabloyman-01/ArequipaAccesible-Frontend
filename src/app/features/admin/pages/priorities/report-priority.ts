import { PercentPipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, mensajeError } from '../../../../core/api.service';
import { DatosPrioridad, EvaluacionPrioridad, Severidad } from '../../../../core/api.models';

@Component({
  selector: 'app-report-priority',
  imports: [FormsModule, PercentPipe],
  templateUrl: './report-priority.html',
})
export class ReportPriority implements OnInit {
  readonly reporteId = input.required<number>();
  private readonly api = inject(ApiService);
  readonly estado = signal<EvaluacionPrioridad | null>(null);
  readonly error = signal('');
  readonly busy = signal(false);
  readonly tipos: { value: DatosPrioridad['tipo']; label: string }[] = [
    { value: 'VEREDA_DANADA', label: 'Vereda dañada' },
    { value: 'SIN_RAMPA', label: 'Sin rampa' },
    { value: 'RAMPA_DETERIORADA', label: 'Rampa deteriorada' },
    { value: 'OBSTACULO', label: 'Obstáculo' },
    { value: 'DESNIVEL', label: 'Desnivel' },
  ];
  tipo: DatosPrioridad['tipo'] | '' = '';
  zona: boolean | null = null;
  flujo: number | null = null;
  correccion: Severidad | '' = '';

  async ngOnInit() {
    this.busy.set(true);
    try {
      this.actualizar(await this.api.prioridad(this.reporteId()));
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }

  async guardar() {
    if (!this.tipo || this.zona === null || this.flujo === null || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      this.actualizar(
        await this.api.guardarPrioridad(this.reporteId(), {
          tipo: this.tipo,
          zonaSensible: this.zona,
          flujoPeatonal: this.flujo,
          correccion: this.correccion || null,
        }),
      );
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }

  private actualizar(estado: EvaluacionPrioridad) {
    this.estado.set(estado);
    const datos = estado.prioridad?.datos;
    this.tipo = datos?.tipo ?? '';
    this.zona = datos?.zonaSensible ?? null;
    this.flujo = datos?.flujoPeatonal ?? null;
    this.correccion = datos?.correccion ?? '';
  }
}
