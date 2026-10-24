import { Injectable, inject } from '@angular/core';
import { ApiService, Filtros } from '../../../core/api.service';
@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly api = inject(ApiService);
  listar(filtros: Filtros = {}) {
    return this.api.reportes(true, filtros);
  }
}
