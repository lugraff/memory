import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineInfoService } from './services/machine-info-service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="w-screen h-screen bg-bgA flex text-textA selection:bg-selection">
    <div class="grow w-full h-full">
      <router-outlet></router-outlet>
    </div>
  </div>`,
})
export class AppComponent {
  machine = inject(MachineInfoService);

  constructor() {
    if (this.machine.isMobile) {
      screen.orientation.lock('landscape');
    }
  }
}
