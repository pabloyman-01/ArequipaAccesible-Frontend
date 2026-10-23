import { DecimalPipe } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { UserRole, UserStatus } from '../../models/user.models';

@Component({
  selector: 'app-users-filters',
  imports: [DecimalPipe],
  templateUrl: './users-filters.html',
})
export class UsersFilters {
  readonly search = model('');
  readonly role = model<UserRole | ''>('');
  readonly status = model<UserStatus | ''>('');
  readonly district = model('');
  readonly total = input.required<number>();

  protected readonly roleOptions: { value: UserRole | ''; label: string }[] = [
    { value: '', label: 'Todos los Roles' },
    { value: 'administrador', label: 'Administrador' },
    { value: 'ciudadano', label: 'Ciudadano' },
  ];

  protected readonly statusOptions: { value: UserStatus | ''; label: string }[] = [
    { value: '', label: 'Estado: Todos' },
    { value: 'activo', label: 'Activo' },
    { value: 'en-revision', label: 'En Revisión' },
    { value: 'suspendido', label: 'Suspendido' },
    { value: 'inactivo', label: 'Inactivo' },
  ];

  protected readonly districtOptions = [
    { value: '', label: 'Jurisdicción: Todas' },
    { value: 'cercado', label: 'Cercado (Monumental)' },
    { value: 'yanahuara', label: 'Yanahuara' },
    { value: 'cayma', label: 'Cayma' },
    { value: 'paucarpata', label: 'Paucarpata' },
    { value: 'cerro-colorado', label: 'Cerro Colorado' },
    { value: 'sachaca', label: 'Sachaca' },
  ];

  protected clearFilters(): void {
    this.search.set('');
    this.role.set('');
    this.status.set('');
    this.district.set('');
  }
}
