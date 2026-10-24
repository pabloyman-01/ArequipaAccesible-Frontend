import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, mensajeError } from '../../../../core/api.service';
import { Catalogo, ESTADOS, ResumenDashboard, etiquetaEstado } from '../../../../core/api.models';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { DashboardKpi } from '../../models/dashboard.models';
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, KpiCard],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly api = inject(ApiService);
  readonly summary = signal<ResumenDashboard | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly estados = ESTADOS;
  readonly etiqueta = etiquetaEstado;
  distritos: Catalogo[] = [];
  desde = '';
  hasta = '';
  distritoId = '';
  readonly kpis = computed<DashboardKpi[]>(() => {
    const s = this.summary();
    if (!s) return [];
    return [
      {
        id: 'total',
        label: 'Total de reportes',
        value: String(s.total),
        detail: 'Creados en el período seleccionado',
        icon: 'folder_open',
        tone: 'default',
      },
      {
        id: 'pendientes',
        label: 'Pendientes',
        value: String(s.pendientes),
        detail: 'Reportes en estados no terminales',
        icon: 'pending_actions',
        tone: 'attention',
      },
      {
        id: 'atendidos',
        label: 'Atendidos',
        value: String(s.atendidos),
        detail: 'Estado actual ATENDIDO',
        icon: 'task_alt',
        tone: 'success',
      },
      {
        id: 'rechazados',
        label: 'Rechazados',
        value: String(s.rechazados),
        detail: 'Estado actual RECHAZADO',
        icon: 'cancel',
        tone: 'default',
      },
    ];
  });
  async ngOnInit() {
    try {
      [this.distritos] = await this.api.catalogos();
    } catch (error) {
      this.error.set(mensajeError(error));
    }
    await this.load();
  }
  async load() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      this.summary.set(
        await this.api.resumen({
          desde: this.desde,
          hasta: this.hasta,
          distritoId: this.distritoId,
        }),
      );
    } catch (error) {
      this.summary.set(null);
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
