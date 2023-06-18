import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-main',
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>Hallo Welt</div>`,
})
export class MainComponent {
}
