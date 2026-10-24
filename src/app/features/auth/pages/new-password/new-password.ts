import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { mensajeError } from '../../../../core/api.service';

@Component({
  selector: 'app-new-password',
  imports: [FormsModule, RouterLink],
  template: ` <main class="auth-shell">
    <section class="panel">
      <h1 class="page-title">Nueva contraseña</h1>
      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      @if (done()) {
        <p class="notice" role="status">
          Contraseña actualizada. Inicia sesión con tu nueva contraseña.
        </p>
        <a routerLink="/inicio-sesion" class="btn">Iniciar sesión</a>
      } @else {
        <form (ngSubmit)="save()" class="grid gap-5">
          <label
            >Nueva contraseña<input
              class="field"
              name="password"
              [(ngModel)]="password"
              type="password"
              minlength="8"
              required
              autocomplete="new-password"
          /></label>
          <label
            >Repetir contraseña<input
              class="field"
              name="confirmation"
              [(ngModel)]="confirmation"
              type="password"
              required
              autocomplete="new-password"
          /></label>
          <button class="btn" [disabled]="busy()" type="submit">Guardar contraseña</button>
        </form>
      }
    </section>
  </main>`,
})
export class NewPassword {
  private readonly auth = inject(AuthService);
  password = '';
  confirmation = '';
  readonly busy = signal(false);
  readonly error = signal('');
  readonly done = signal(false);
  async save() {
    if (this.busy()) return;
    this.error.set('');
    if (this.password !== this.confirmation) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.busy.set(true);
    try {
      if (!this.auth.session())
        throw new Error('El enlace caducó. Solicita uno nuevo desde recuperación de contraseña.');
      await this.auth.updatePassword(this.password);
      this.password = '';
      this.confirmation = '';
      await this.auth.signOut();
      this.done.set(true);
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
