import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/api.service';
import { AvisoReporte, etiquetaEstado } from '../../../../core/api.models';
import { AuthService } from '../../../../core/auth.service';

@Component({
  selector: 'app-citizen-notices',
  imports: [DatePipe, RouterLink],
  templateUrl: './citizen-notices.html',
})
export class CitizenNotices {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly propietario = computed(() => this.auth.profile()?.id);
  private readonly leidos = signal(new Set<number>());
  readonly avisos = signal<AvisoReporte[]>([]);
  readonly sinLeer = computed(
    () => this.avisos().filter((aviso) => !this.leidos().has(aviso.id)).length,
  );
  readonly etiquetaEstado = etiquetaEstado;

  constructor() {
    effect((onCleanup) => {
      const id = this.propietario();
      this.avisos.set([]);
      this.leidos.set(id ? this.leerGuardados(id) : new Set());
      if (!id) return;
      let cancelado = false;
      let consultando = false;
      const refrescar = async () => {
        if (document.hidden || consultando) return;
        consultando = true;
        try {
          const avisos = await this.api.avisos();
          if (!cancelado && id === this.propietario()) this.avisos.set(avisos);
        } catch {
          // Preserve the last successful update until the next poll.
        } finally {
          consultando = false;
        }
      };
      void refrescar();
      const timer = window.setInterval(() => void refrescar(), 30_000);
      const alVolver = () => void refrescar();
      document.addEventListener('visibilitychange', alVolver);
      onCleanup(() => {
        cancelado = true;
        window.clearInterval(timer);
        document.removeEventListener('visibilitychange', alVolver);
      });
    });
  }

  marcarLeidos() {
    const id = this.propietario();
    if (!id) return;
    const vistos = Array.from(new Set([...this.avisos().map((a) => a.id), ...this.leidos()])).slice(
      0,
      150,
    );
    this.leidos.set(new Set(vistos));
    try {
      localStorage.setItem(this.clave(id), JSON.stringify(vistos));
    } catch {
      // Mark them for the current visit when browser storage is unavailable.
    }
  }

  private leerGuardados(id: string): Set<number> {
    try {
      const datos: unknown = JSON.parse(localStorage.getItem(this.clave(id)) ?? '[]');
      return new Set(
        Array.isArray(datos)
          ? datos.filter((dato): dato is number => Number.isSafeInteger(dato))
          : [],
      );
    } catch {
      return new Set();
    }
  }

  private clave(id: string) {
    return 'arequipa-accesible:avisos:' + id;
  }
}
