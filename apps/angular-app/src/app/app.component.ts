import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Can't do this in Angular, do to the '.ts' imports issue
// import { assertNever } from '@axhxrx/assert-never';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-app';
}
