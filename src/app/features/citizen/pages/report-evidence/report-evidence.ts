import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-evidence',
  imports: [RouterLink],
  templateUrl: './report-evidence.html',
})
export class ReportEvidence {
  protected readonly address = signal('Calle San Francisco 312, Cercado de Arequipa');
}
