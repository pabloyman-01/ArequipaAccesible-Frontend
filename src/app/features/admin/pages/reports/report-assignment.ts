import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, mensajeError } from '../../../../core/api.service';
import { AreaMunicipal, AsignacionMunicipal, EstadoReporte } from '../../../../core/api.models';

@Component({
  selector: 'app-report-assignment',
  imports: [FormsModule, DatePipe],
  templateUrl: './report-assignment.html',
})
export class ReportAssignment implements OnInit {
  readonly reporteId = input.required<number>();
  readonly estado = input.required<EstadoReporte>();
  readonly asignado = output<void>();
  private readonly api = inject(ApiService);
  readonly asignacion = signal<AsignacionMunicipal | null>(null);
  readonly areas = signal<AreaMunicipal[]>([]);
  readonly busy = signal(false);
  readonly error = signal('');
  areaId: number | null = null;

  async ngOnInit() {
    this.busy.set(true);
    try {
      const [asignacion, areas] = await Promise.all([
        this.api.asignacionMunicipal(this.reporteId()),
        this.api.areasMunicipales(),
      ]);
      this.asignacion.set(asignacion);
      this.areas.set(areas);
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }

  async asignar() {
    if (!this.areaId || this.busy() || this.estado() !== 'EN_EVALUACION') return;
    this.busy.set(true);
    this.error.set('');
    try {
      this.asignacion.set(await this.api.asignarReporte(this.reporteId(), this.areaId));
      this.asignado.emit();
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
