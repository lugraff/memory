import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-memory-game',
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memory-game.html',
})
export class MemoryGameComponent {}
