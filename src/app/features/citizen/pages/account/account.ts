import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citizen-account',
  imports: [FormsModule],
  templateUrl: './account.html',
})
export class CitizenAccount {
  protected readonly isEditing = signal(false);
  protected readonly saved = signal(false);

  protected profile = {
    name: 'Aarón Benito Cáceres',
    dni: '70825419',
    email: 'aaron.caceres@email.com',
    phone: '987 654 321',
    district: 'Cercado de Arequipa',
    address: 'Calle San Francisco 315',
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
