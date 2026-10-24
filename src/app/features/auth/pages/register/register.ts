import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
})
export class Register {
  protected readonly documentNumber = signal('');
  protected readonly names = signal('');
  protected readonly surnames = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);
  protected readonly showConfirmation = signal(false);
  protected readonly reniecValidated = signal(false);
  protected readonly submitState = signal<'idle' | 'loading' | 'success'>('idle');

  protected readonly passwordStrength = computed(() => {
    const length = this.password().length;
    if (!length) return { label: 'Básica', width: 'w-1/4', color: 'bg-outline', text: 'text-outline' };
    if (length < 6) return { label: 'Débil', width: 'w-1/3', color: 'bg-error', text: 'text-error' };
    if (length < 10) return { label: 'Media', width: 'w-2/3', color: 'bg-secondary-container', text: 'text-on-secondary-container' };
    return { label: 'Robusta', width: 'w-full', color: 'bg-primary-container', text: 'text-primary' };
  });

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected toggleConfirmationVisibility(): void {
    this.showConfirmation.update((value) => !value);
  }

  protected updateDocument(value: string): void {
    this.documentNumber.set(value.replace(/[^0-9]/g, '').slice(0, 8));
  }

  protected validateDocument(): void {
    if (this.documentNumber().length !== 8) return;
    this.names.set('Rosa María');
    this.surnames.set('Quispe Bustamante');
    this.reniecValidated.set(true);
  }

  protected submit(): void {
    if (this.submitState() === 'loading') return;
    this.submitState.set('loading');
    window.setTimeout(() => this.submitState.set('success'), 800);
  }
}
