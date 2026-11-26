import { AuthService } from '../../../../core/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitizenNotices } from '../citizen-notices/citizen-notices';

@Component({
  selector: 'app-citizen-header',
  imports: [RouterLink, CitizenNotices],
  templateUrl: './citizen-header.html',
})
export class CitizenHeader {
  readonly auth = inject(AuthService);
}
