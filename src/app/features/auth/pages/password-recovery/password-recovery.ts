import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { mensajeError } from '../../../../core/api.service';
@Component({
  selector: 'app-password-recovery',
  imports: [FormsModule, RouterLink],
  templateUrl: './password-recovery.html',
})
export class PasswordRecovery {
  private readonly auth = inject(AuthService);
  email = '';
  readonly busy = signal(false);
  readonly done = signal(false);
  readonly error = signal('');
  async submit() {
    if (this.busy() || this.done()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.auth.requestRecovery(this.email.trim());
      this.done.set(true);
    } catch (error) {
      this.error.set(mensajeError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
