import { AuthService } from '../../../../core/auth.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-citizen-header',
  templateUrl: './citizen-header.html',
})
export class CitizenHeader {
  readonly auth = inject(AuthService);
}
