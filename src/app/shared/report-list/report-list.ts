import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Filtros, mensajeError } from '../../core/api.service';
import { Catalogo, ESTADOS, Pagina, Reporte, etiquetaEstado } from '../../core/api.models';

@Component({
  selector: 'app-report-list',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './report-list.html',
})
export class ReportList implements OnInit {
  @Input() admin = false;
  @Input() welcome = false;
  private readonly api = inject(ApiService);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly page = signal<Pagina<Reporte> | null>(null);
  readonly estados = ESTADOS;
  readonly etiqueta = etiquetaEstado;
  distritos: Catalogo[] = [];
  tipos: Catalogo[] = [];
  codigo = '';
  estado = '';
  distritoId = '';
  tipoBarreraId = '';
  severidadDeclarada = '';
  desde = '';
  hasta = '';
  index = 0;
  private cursors: (string | null)[] = [null];
  private applied: Filtros = {};
  async ngOnInit() {
    await Promise.all([this.catalogos(), this.load(0)]);
  }
  private async catalogos() {
    try {
      [this.distritos, this.tipos] = await this.api.catalogos();
    } catch (error) {
      this.error.set(mensajeError(error));
    }
  }
  nombre(id: number, catalogo: Catalogo[]) {
    return catalogo.find((c) => c.id === id)?.nombre ?? String(id);
  }
  async apply() {
    if (this.busy()) return;
    this.applied = {
      codigo: this.codigo,
      estado: this.estado,
      distritoId: this.distritoId,
      tipoBarreraId: this.tipoBarreraId,
      severidadDeclarada: this.severidadDeclarada,
      desde: this.desde,
      hasta: this.hasta,
    };
    this.cursors = [null];
    await this.load(0);
  }
  async load(index: number) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const page = await this.api.reportes(this.admin, {
        ...this.applied,
        limite: 20,
        cursor: this.cursors[index],
      });
      this.page.set(page);
      this.index = index;
      if (page.siguienteCursor) this.cursors[index + 1] = page.siguienteCursor;
    } catch (error) {
      this.error.set(mensajeError(error));
      this.page.set(null);
    } finally {
      this.busy.set(false);
    }
  }
}
