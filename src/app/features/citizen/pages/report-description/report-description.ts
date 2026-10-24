import { ApiService, mensajeError } from '../../../../core/api.service';
import { ReportDraftService } from '../../../../core/report-draft.service';
import { Component, inject, computed, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
export class ReportDescription implements OnInit, OnDestroy {
  readonly draft = inject(ReportDraftService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly created = signal<{ id: number; codigo: string } | null>(null);
  protected readonly description = this.draft.descripcion;
  ngOnInit() {
    if (!this.draft.ready()) void this.router.navigateByUrl('/ciudadano/nuevo-reporte');
  }
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
            ? 'Debes permitir el acceso al micrÃ³fono para usar el dictado.'
            : 'No se pudo procesar el dictado. IntÃ©ntalo nuevamente.',
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
      this.voiceError.set('No se pudo iniciar el dictado. IntÃ©ntalo nuevamente.');
    }
  }

  protected async submit(): Promise<void> {
    if (this.isSubmitting() || this.showSuccess() || this.draft.uncertain()) return;
    if (!this.draft.ready() || !this.description().trim()) {
      this.error.set('Completa los tres pasos y escribe una descripciÃ³n.');
      return;
    }
    this.isSubmitting.set(true);
    this.error.set('');
    try {
      const u = this.draft.ubicacion()!;
      const result = await this.api.crear(
        {
          tipoBarreraId: this.draft.tipoBarreraId(),
          severidadDeclarada: this.draft.severidad(),
          distritoId: this.draft.distritoId(),
          direccionReferencia: this.draft.direccion().trim(),
          descripcion: this.description().trim(),
          latitud: u.lat,
          longitud: u.lng,
        },
        this.draft.foto()!,
        this.draft.nombreFoto(),
      );
      this.created.set(result);
      this.showSuccess.set(true);
      this.draft.clear();
    } catch (error) {
      this.error.set(mensajeError(error));
      // No automatic retry for multipart writes: a lost response may follow a successful commit.
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error.status === 0 || Number(error.status) >= 500)
      ) {
        this.draft.uncertain.set(true);
        this.error.set(
          'No se pudo confirmar la respuesta. Consulta Mis Reportes antes de intentar registrar nuevamente.',
        );
      }
    } finally {
      this.isSubmitting.set(false);
    }
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
      return `${description.trimEnd()}${separator}${transcript.trim()}`.slice(0, 3000);
    });
  }
}
