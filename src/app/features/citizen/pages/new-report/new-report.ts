import { ApiService, mensajeError } from '../../../../core/api.service';
import { ReportDraftService } from '../../../../core/report-draft.service';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BarrierOption, SeverityOption } from '../../models/new-report.models';

@Component({
  selector: 'app-new-report',
  imports: [RouterLink],
  templateUrl: './new-report.html',
})
export class NewReport implements OnInit {
  readonly draft = inject(ReportDraftService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly loading = signal(true);
  protected readonly selectedBarrier = this.draft.tipoBarreraId;
  protected readonly selectedSeverity = this.draft.severidad;
  protected barriers: BarrierOption[] = [];
  async ngOnInit() {
    try {
      const [, tipos] = await this.api.catalogos();
      this.barriers = tipos.map((t) => ({
        key: String(t.id),
        title: t.nombre,
        description: t.descripcion ?? '',
        code: t.codigo ?? '',
        icon: 'accessible',
      }));
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.loading.set(false);
    }
  }
  protected continue() {
    if (!this.draft.tipoBarreraId()) {
      this.error.set('Selecciona un tipo de barrera.');
      return;
    }
    if (!this.draft.severidad()) {
      this.error.set('Selecciona la severidad de la barrera.');
      return;
    }
    this.error.set('');
    void this.router.navigateByUrl('/ciudadano/nuevo-reporte/evidencia');
  }
  protected readonly severities: SeverityOption[] = [
    {
      key: 'ALTA',
      badge: 'Valoración ciudadana',
      title: 'Severidad alta',
      description:
        'Bloqueo total: Nadie en silla de ruedas o con bastón puede pasar y tienen que arriesgarse yendo por la pista con los autos.',
      response: 'Sin plazo de atención garantizado',
      icon: 'emergency',
      badgeClass: 'bg-error-container text-on-error-container',
    },
    {
      key: 'MEDIA',
      badge: 'Intervención Regular',
      title: 'Severidad media',
      description:
        'Paso difícil: Se puede avanzar pero con mucho esfuerzo, peligro de caída o desviándose un poco.',
      response: 'Sin plazo de atención garantizado',
      icon: 'schedule',
      badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
    },
    {
      key: 'BAJA',
      badge: 'Mantenimiento Urbano',
      title: 'Severidad baja',
      description:
        'Desgaste inicial: La vereda o pintura se está dañando y conviene repararla antes de que empeore.',
      response: 'Sin plazo de atención garantizado',
      icon: 'event_note',
      badgeClass: 'bg-surface-container-highest text-on-surface-variant',
    },
  ];

  protected selectBarrier(key: string): void {
    this.selectedBarrier.set(Number(key));
  }

  protected selectSeverity(key: string): void {
    if (key === 'ALTA' || key === 'MEDIA' || key === 'BAJA') this.selectedSeverity.set(key);
  }

  protected cancel(): void {
    if (this.draft.hasData() && !window.confirm('¿Quieres descartar los datos del borrador?')) return;
    this.draft.clear();
    void this.router.navigateByUrl('/ciudadano');
  }

  protected moveRadio(event: KeyboardEvent): void {
    const button = event.currentTarget as HTMLButtonElement;
    const group = button.closest('[role="radiogroup"]');
    const options = Array.from(group?.querySelectorAll<HTMLButtonElement>('button[role="radio"]') ?? []);
    const current = options.indexOf(button);
    const directions: Partial<Record<string, number>> = {
      ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1,
    };
    const direction = directions[event.key];
    if (current < 0 || direction === undefined) return;
    event.preventDefault();
    const next = options[(current + direction + options.length) % options.length];
    next.focus();
    next.click();
  }

  protected selectionClass(selected: boolean): string {
    return selected
      ? 'bg-surface-container-low shadow-sm ring-2 ring-primary-container'
      : 'bg-surface-container hover:bg-surface-container-high';
  }
}
