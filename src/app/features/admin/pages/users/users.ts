import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Filtros, mensajeError } from '../../../../core/api.service';
import { AuthService } from '../../../../core/auth.service';
import { Catalogo, Pagina, Perfil } from '../../../../core/api.models';
@Component({ selector: 'app-users', imports: [FormsModule], templateUrl: './users.html' })
export class Users implements OnInit {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly page = signal<Pagina<Perfil> | null>(null);
  distritos: Catalogo[] = [];
  rol = '';
  estadoCuenta = '';
  distritoId = '';
  index = 0;
  private cursors: (string | null)[] = [null];
  private applied: Filtros = {};
  selected: Perfil | null = null;
  motivo = '';
  async ngOnInit() {
    try {
      [this.distritos] = await this.api.catalogos();
    } catch (error) {
      this.error.set(mensajeError(error));
    }
    await this.load(0);
  }
  async apply() {
    if (this.busy()) return;
    this.applied = { rol: this.rol, estadoCuenta: this.estadoCuenta, distritoId: this.distritoId };
    this.cursors = [null];
    this.selected = null;
    await this.load(0);
  }
  async load(index: number) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const data = await this.api.usuarios({
        ...this.applied,
        limite: 20,
        cursor: this.cursors[index],
      });
      this.page.set(data);
      this.index = index;
      if (data.siguienteCursor) this.cursors[index + 1] = data.siguienteCursor;
    } catch (error) {
      this.page.set(null);
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
  select(user: Perfil) {
    this.selected = user;
    this.motivo = '';
    this.notice.set('');
  }
  async change() {
    const u = this.selected;
    if (!u || !this.motivo.trim() || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.notice.set('');
    let message = '';
    try {
      await this.api.cambiarCuenta(
        u.id,
        u.estadoCuenta,
        u.estadoCuenta === 'ACTIVA' ? 'SUSPENDIDA' : 'ACTIVA',
        this.motivo.trim(),
      );
      this.notice.set('Estado de cuenta actualizado.');
      this.selected = null;
      this.motivo = '';
    } catch (error) {
      message = mensajeError(error);
    } finally {
      this.busy.set(false);
      await this.load(this.index);
      if (message) this.error.set(message);
    }
  }
}
