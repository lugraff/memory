import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-memory-game',
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memory-game.html',
})
export class MemoryGameComponent {
  public store = inject(StoreService);
}
