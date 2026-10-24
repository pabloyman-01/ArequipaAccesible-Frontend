import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { correoLimitado, mensajeError } from '../../../../core/api.service';
@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly showPassword = signal(false);
  protected readonly highContrast = signal(false);
  protected readonly loginState = signal<'idle' | 'loading' | 'success'>('idle');
  protected readonly error = signal('');
  email = '';
  password = '';
  readonly linkSent = signal(false);
  readonly linkBlocked = signal(false);
  async sendLink() {
    if (this.loginState() === 'loading' || this.linkSent() || this.linkBlocked()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.error.set('Introduce tu correo electrónico.');
      return;
    }
    this.loginState.set('loading');
    this.error.set('');
    try {
      await this.auth.loginWithLink(this.email.trim());
      this.linkSent.set(true);
    } catch (error) {
      if (correoLimitado(error)) this.linkBlocked.set(true);
      this.error.set(mensajeError(error));
    } finally {
      this.loginState.set('idle');
    }
  }
  protected toggleHighContrast() {
    this.highContrast.update((v) => !v);
  }
  protected togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }
  protected async submit() {
    if (this.loginState() === 'loading') return;
    this.loginState.set('loading');
    this.error.set('');
    try {
      await this.auth.login(this.email.trim(), this.password);
      this.password = '';
      this.loginState.set('success');
      await this.router.navigateByUrl(this.auth.home());
    } catch (error) {
      this.password = '';
      this.error.set(mensajeError(error));
      this.loginState.set('idle');
    }
  }
}
