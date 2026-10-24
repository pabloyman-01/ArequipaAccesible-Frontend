import { Injectable, inject } from '@angular/core';
import { ApiService, Filtros } from '../../../core/api.service';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiService);
  resumen(filtros: Filtros = {}) {
    return this.api.resumen(filtros);
  }
}
