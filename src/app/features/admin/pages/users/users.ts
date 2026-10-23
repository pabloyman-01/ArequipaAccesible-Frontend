import { Component, computed, inject, signal } from '@angular/core';
import { UsersFilters } from '../../components/users-filters/users-filters';
import { UsersKpis } from '../../components/users-kpis/users-kpis';
import { UsersTable } from '../../components/users-table/users-table';
import { UserRole, UserStatus } from '../../models/user.models';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  imports: [UsersKpis, UsersFilters, UsersTable],
  templateUrl: './users.html',
})
export class Users {
  private readonly usersService = inject(UsersService);

  protected readonly kpis = this.usersService.kpis;
  protected readonly totalRegistered = this.usersService.totalRegistered;

  protected readonly search = signal('');
  protected readonly role = signal<UserRole | ''>('');
  protected readonly status = signal<UserStatus | ''>('');
  protected readonly district = signal('');

  protected readonly filteredUsers = computed(() => {
    const search = this.normalize(this.search().trim());
    const role = this.role();
    const status = this.status();
    const district = this.district();

    return this.usersService.users.filter((user) => {
      const matchesSearch =
        !search ||
        [
          user.name,
          user.dni,
          user.email,
          user.dependency,
          user.jurisdiction.area,
          user.jurisdiction.sector,
        ].some((value) => this.normalize(value).includes(search));

      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;
      const matchesDistrict = !district || user.jurisdiction.districtKey === district;

      return matchesSearch && matchesRole && matchesStatus && matchesDistrict;
    });
  });

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
