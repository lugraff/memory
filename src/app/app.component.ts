import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MachineInfoService } from './services/machine-info-service';
import { MemoryGameComponent } from './components/memory/memory-game';

@Component({
  selector: 'app-root',
  imports: [MemoryGameComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="w-screen h-screen from-bgA to-bgB bg-gradient-to-t flex text-white selection:bg-selection">
    <div class="grow w-full h-full">
      <app-memory-game></app-memory-game>
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
