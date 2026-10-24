import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ApiService, mensajeError } from '../../core/api.service';
import { Catalogo } from '../../core/api.models';

@Component({ selector: 'app-profile', imports: [FormsModule], templateUrl: './profile.html' })
export class Profile implements OnInit {
  readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly success = signal('');
  readonly busy = signal(false);
  readonly loading = signal(true);
  distritos: Catalogo[] = [];
  nombres = '';
  apellidos = '';
  tipoDocumento = 'DNI';
  documento = '';
  telefono = '';
  distritoId = '';
  async ngOnInit() {
    try {
      const [p, [distritos]] = await Promise.all([
        this.auth.refreshProfile(),
        this.api.catalogos(),
      ]);
      this.distritos = distritos;
      if (p) {
        this.nombres = p.nombres;
        this.apellidos = p.apellidos;
        this.telefono = p.telefono ?? '';
        this.distritoId = p.distritoId ? String(p.distritoId) : '';
      }
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.loading.set(false);
    }
  }
  async save() {
    if (this.busy() || this.loading()) return;
    this.busy.set(true);
    this.error.set('');
    this.success.set('');
    try {
      const alta = !this.auth.profile();
      const datos: Record<string, unknown> = {
        nombres: this.nombres.trim(),
        apellidos: this.apellidos.trim(),
      };
      if (this.telefono.trim()) datos['telefono'] = this.telefono.trim();
      if (this.distritoId) datos['distritoId'] = Number(this.distritoId);
      if (alta) {
        datos['tipoDocumento'] = this.tipoDocumento;
        datos['documento'] = this.documento.trim();
      }
      const p = await this.api.guardarPerfil(datos, alta);
      this.auth.profile.set(p);
      this.documento = '';
      this.success.set('Perfil guardado.');
      if (alta) await this.router.navigateByUrl(this.auth.home());
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
