import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="w-screen h-screen flex text-textA selection:bg-selection">
    <div class="grow w-full h-full">
      <router-outlet></router-outlet>
    </div>
  </div>`,
})
export class AppComponent {
  constructor() {
    screen.orientation.lock('landscape');
  }
}
