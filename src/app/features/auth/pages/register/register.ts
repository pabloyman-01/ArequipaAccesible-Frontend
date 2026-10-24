import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { mensajeError } from '../../../../core/api.service';
@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  email = '';
  password = '';
  confirmation = '';
  readonly busy = signal(false);
  readonly error = signal('');
  readonly done = signal(false);
  readonly awaitingConfirmation = signal(false);
  async submit() {
    if (this.busy() || this.done()) return;
    this.error.set('');
    if (this.password !== this.confirmation) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.busy.set(true);
    try {
      const session = await this.auth.signup(this.email.trim(), this.password);
      this.password = '';
      this.confirmation = '';
      this.awaitingConfirmation.set(!session);
      this.done.set(true);
      if (session) await this.router.navigateByUrl('/inicio-sesion/completar-perfil');
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
