import { AuthService } from '../../../../core/auth.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class AdminSidebar {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly activeLinkClass =
    'flex items-center gap-space-sm rounded-full bg-primary-container px-space-md py-space-sm font-bold text-on-primary shadow-sm transition-colors';

  protected readonly inactiveLinkClass =
    'flex items-center gap-space-sm rounded-full px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface';

  protected signOut(): void {
    void this.auth.signOut();
  }
}
