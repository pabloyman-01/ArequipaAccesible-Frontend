import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CitizenHeader } from '../components/citizen-header/citizen-header';
import { CitizenSidebar } from '../components/citizen-sidebar/citizen-sidebar';

@Component({
  selector: 'app-citizen-layout',
  imports: [RouterOutlet, CitizenHeader, CitizenSidebar],
  templateUrl: './citizen-layout.html',
})
export class CitizenLayout {}
