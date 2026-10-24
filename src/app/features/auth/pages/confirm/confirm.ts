import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { mensajeError } from '../../../../core/api.service';

@Component({
  selector: 'app-confirm',
  imports: [RouterLink],
  template: `<main class="auth-shell">
    <section class="panel">
      <h1 class="page-title">Confirmación de cuenta</h1>
      <p role="status">{{ message() }}</p>
      <a class="btn-secondary" routerLink="/inicio-sesion">Ir a iniciar sesión</a>
    </section>
  </main>`,
})
export class Confirm implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly message = signal('Validando tu sesión…');
  async ngOnInit() {
    try {
      if (!this.auth.session()) {
        this.message.set(
          'El enlace caducó, ya se usó o se abrió en otro navegador. Inicia sesión con tu correo y contraseña.',
        );
        return;
      }
      await this.auth.refreshProfile();
      this.message.set('Cuenta confirmada.');
      await this.router.navigateByUrl(this.auth.home());
    } catch (error) {
      this.message.set(mensajeError(error));
    }
  }
}
