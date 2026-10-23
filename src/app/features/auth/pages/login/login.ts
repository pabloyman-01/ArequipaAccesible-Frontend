import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
})
export class Login {
  protected readonly showPassword = signal(false);
  protected readonly highContrast = signal(false);
  protected readonly loginState = signal<'idle' | 'loading' | 'success'>('idle');

  protected toggleHighContrast(): void {
    this.highContrast.update((value) => !value);
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected submit(): void {
    if (this.loginState() === 'loading') {
      return;
    }

    this.loginState.set('loading');
    window.setTimeout(() => this.loginState.set('success'), 1200);
  }
}
