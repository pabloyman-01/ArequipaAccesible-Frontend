import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.html',
})
export class AdminHeader {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly breadcrumb = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.resolveBreadcrumb()),
    ),
    { initialValue: 'Dashboard de Gestión' },
  );

  private resolveBreadcrumb(): string {
    let route = this.route.firstChild;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    return (route?.snapshot.data['breadcrumb'] as string | undefined) ?? 'Dashboard de Gestión';
  }
}
