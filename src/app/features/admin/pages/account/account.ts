import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-account',
  imports: [FormsModule],
  templateUrl: './account.html',
})
export class AdminAccount {
  protected readonly isEditing = signal(false);
  protected readonly saved = signal(false);

  protected profile = {
    name: 'Valeria Paredes',
    dni: '42158796',
    email: 'vparedes@muniarequipa.gob.pe',
    phone: '(054) 200 100 anexo 214',
    position: 'Supervisora General',
    dependency: 'Gerencia de Desarrollo Urbano y OMAPED',
  };
  private originalProfile = { ...this.profile };

  protected enableEditing(): void {
    this.saved.set(false);
    this.originalProfile = { ...this.profile };
    this.isEditing.set(true);
  }

  protected save(): void {
    this.originalProfile = { ...this.profile };
    this.isEditing.set(false);
    this.saved.set(true);
  }

  protected cancel(): void {
    this.profile = { ...this.originalProfile };
    this.isEditing.set(false);
  }
}
