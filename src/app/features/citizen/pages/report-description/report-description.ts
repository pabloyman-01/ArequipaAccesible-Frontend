import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const INITIAL_DESCRIPTION =
  'El rebaje de la vereda de sillar en la intersección se encuentra quebrado con desnivel abrupto de 8.2 cm, bloqueando el giro seguro de sillas de ruedas e impidiendo cruzar hacia la Calle San Francisco.';

@Component({
  selector: 'app-report-description',
  imports: [RouterLink],
  templateUrl: './report-description.html',
})
export class ReportDescription {
  protected readonly description = signal(INITIAL_DESCRIPTION);
  protected readonly isListening = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly showSuccess = signal(false);
  protected readonly characterCount = computed(() => this.description().length);

  protected toggleVoiceInput(): void {
    this.isListening.update((value) => !value);
  }

  protected submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    window.setTimeout(() => {
      this.isSubmitting.set(false);
      this.showSuccess.set(true);
    }, 700);
  }
}
