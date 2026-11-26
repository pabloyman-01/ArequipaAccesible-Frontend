import { PercentPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, mensajeError } from '../../../../core/api.service';
import { EvaluacionPrioridad } from '../../../../core/api.models';

@Component({
  selector: 'app-priorities',
  imports: [RouterLink, PercentPipe],
  template: `
    <main class="grid gap-4 pb-8">
      <a class="text-primary underline" routerLink="/reportes">Volver a reportes</a>
      <h1 class="page-title">Bandeja de prioridad</h1>
      <p>
        Hasta 200 reportes abiertos con evaluación, ordenados por la prioridad aplicada. El modelo
        es experimental.
      </p>
      <button class="btn-secondary justify-self-start" (click)="cargar()" [disabled]="busy()">
        Actualizar
      </button>
      @if (busy()) {
        <p role="status">Calculando prioridades…</p>
      }
      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      @if (!filas().length && !busy() && !error()) {
        <p>Aún no hay reportes evaluados.</p>
      }
      <ol class="grid gap-3">
        @for (fila of filas(); track fila.prioridad?.reporteId) {
          @if (fila.prioridad; as p) {
            <li class="panel">
              <a
                class="font-bold text-primary underline"
                [routerLink]="['/reportes', p.reporteId]"
                >{{ p.codigo }}</a
              >
              <p>
                Prioridad aplicada: {{ p.nivelAplicado }} · Probabilidad estimada:
                {{ p.probabilidad | percent: '1.0-0' }}
              </p>
              <p>{{ fila.reportesCercanos }} reportes cercanos · {{ fila.diasSinAtencion }} días</p>
            </li>
          }
        }
      </ol>
    </main>
  `,
})
export class Priorities implements OnInit {
  private readonly api = inject(ApiService);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly filas = signal<EvaluacionPrioridad[]>([]);

  ngOnInit(): void {
    void this.cargar();
  }

  async cargar() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      this.filas.set(await this.api.bandejaPrioridad());
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
