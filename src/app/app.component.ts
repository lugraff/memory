import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
