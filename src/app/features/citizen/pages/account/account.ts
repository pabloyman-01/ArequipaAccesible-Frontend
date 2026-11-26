import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService, mensajeError } from '../../../../core/api.service';
import { Profile } from '../../../../shared/profile/profile';

@Component({
  selector: 'app-citizen-account',
  imports: [DatePipe, Profile],
  templateUrl: './account-assistance.html',
})
export class CitizenAccount {
  private readonly api = inject(ApiService);
  readonly autorizacion = signal<{ codigo: string; venceEn: string } | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly aviso = signal('');

  async cambiarAutorizacion(generar: boolean) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.aviso.set('');
    try {
      if (generar) {
        this.autorizacion.set(await this.api.emitirAutorizacion());
        this.aviso.set('Autorización generada.');
      } else {
        await this.api.revocarAutorizacion();
        this.autorizacion.set(null);
        this.aviso.set('Autorización revocada.');
      }
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
