import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-citizen-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './citizen-sidebar.html',
})
export class CitizenSidebar {
  protected readonly activeLinkClass =
    'flex items-center gap-space-sm rounded-full bg-primary-container px-space-md py-space-sm font-bold text-on-primary shadow-sm transition-colors';

  protected readonly inactiveLinkClass =
    'flex items-center gap-space-sm rounded-full px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface';
}
