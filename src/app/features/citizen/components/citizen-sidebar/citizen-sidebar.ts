import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-citizen-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './citizen-sidebar.html',
})
export class CitizenSidebar {
  protected readonly activeLinkClass =
    'flex items-center gap-3 rounded-xl bg-primary px-3.5 py-2.5 text-[14px] font-semibold text-on-primary shadow-sm transition-all';

  protected readonly inactiveLinkClass =
    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface';
}
