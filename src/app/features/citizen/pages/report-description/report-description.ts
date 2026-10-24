import { Component, computed, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const INITIAL_DESCRIPTION =
  'El rebaje de la vereda de sillar en la intersección se encuentra quebrado con desnivel abrupto de 8.2 cm, bloqueando el giro seguro de sillas de ruedas e impidiendo cruzar hacia la Calle San Francisco.';

interface VoiceRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface VoiceRecognitionEvent {
  resultIndex: number;
  results: ArrayLike<VoiceRecognitionResult>;
}

interface VoiceRecognitionErrorEvent {
  error: string;
}

interface VoiceRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: VoiceRecognitionEvent) => void) | null;
  onerror: ((event: VoiceRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type VoiceRecognitionConstructor = new () => VoiceRecognition;

@Component({
  selector: 'app-report-description',
  imports: [RouterLink],
  templateUrl: './report-description.html',
})
export class ReportDescription implements OnDestroy {
  protected readonly description = signal(INITIAL_DESCRIPTION);
  protected readonly isListening = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly showSuccess = signal(false);
  protected readonly voiceError = signal('');
  protected readonly characterCount = computed(() => this.description().length);

  private recognition?: VoiceRecognition;

  ngOnDestroy(): void {
    this.recognition?.abort();
  }

  protected toggleVoiceInput(): void {
    if (this.isListening()) {
      this.recognition?.stop();
      return;
    }

    const Recognition = this.getRecognitionConstructor();
    if (!Recognition) {
      this.voiceError.set('El dictado por voz no es compatible con este navegador.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'es-PE';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => this.appendTranscript(event);
    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        this.voiceError.set(
          event.error === 'not-allowed'
            ? 'Debes permitir el acceso al micrófono para usar el dictado.'
            : 'No se pudo procesar el dictado. Inténtalo nuevamente.',
        );
      }
    };
    recognition.onend = () => {
      this.isListening.set(false);
      this.recognition = undefined;
    };

    try {
      recognition.start();
      this.recognition = recognition;
      this.voiceError.set('');
      this.isListening.set(true);
    } catch {
      this.voiceError.set('No se pudo iniciar el dictado. Inténtalo nuevamente.');
    }
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

  private getRecognitionConstructor(): VoiceRecognitionConstructor | undefined {
    const browserWindow = window as Window & {
      SpeechRecognition?: VoiceRecognitionConstructor;
      webkitSpeechRecognition?: VoiceRecognitionConstructor;
    };

    return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
  }

  private appendTranscript(event: VoiceRecognitionEvent): void {
    let transcript = '';
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      if (result.isFinal) {
        transcript += `${result[0].transcript} `;
      }
    }

    if (!transcript.trim()) {
      return;
    }

    this.description.update((description) => {
      const separator = description.trim() ? ' ' : '';
      return `${description.trimEnd()}${separator}${transcript.trim()}`.slice(0, 500);
    });
  }
}
