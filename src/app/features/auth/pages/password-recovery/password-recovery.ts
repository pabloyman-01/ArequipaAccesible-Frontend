import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  imports: [RouterLink],
  templateUrl: './password-recovery.html',
})
export class PasswordRecovery {
  protected readonly sendState = signal<'idle' | 'loading' | 'success'>('idle');

  protected submit(): void {
    if (this.sendState() === 'loading') return;

    this.sendState.set('loading');
    window.setTimeout(() => this.sendState.set('success'), 700);
  }
}
