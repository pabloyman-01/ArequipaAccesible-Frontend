import { Component } from '@angular/core';
import { Profile } from '../../../../shared/profile/profile';
@Component({ selector: 'app-admin-account', imports: [Profile], template: '<app-profile />' })
export class AdminAccount {}
