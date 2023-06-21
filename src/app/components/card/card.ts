import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-card',
  imports: [CommonModule, FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
})
export class CardComponent {
  public store = inject(StoreService);

  @HostBinding('class') public class = 'relative';

  @Input() public id = -1;

  public animOpenStarted = signal(false);
  public animCloseStarted = signal(false);

  public randomRotate = signal((Math.random() - 0.5) * 9);

  public onDown(): void {
    this.store.gameData.mutate((state) => {
      state.cards[this.id].zIndex = state.lastZ++;
    });
    // this.zIndex.update((number) => number++);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.randomRotate.set((Math.random() - 0.5) * 9);
      if (this.store.gameData().cards[this.id].open) {
        this.CloseAnimation();
      } else {
        this.OpenAnimation();
      }
    }
  }

  private OpenAnimation(): void {
    this.animOpenStarted.set(true);
    setTimeout(() => {
      this.store.gameData.mutate((gameData) => (gameData.cards[this.id].open = true));
      setTimeout(() => {
        this.animOpenStarted.set(false);
      }, 300);
    }, 300);
  }

  private CloseAnimation(): void {
    this.animCloseStarted.set(true);
    setTimeout(() => {
      this.store.gameData.mutate((gameData) => (gameData.cards[this.id].open = false));
      setTimeout(() => {
        this.animCloseStarted.set(false);
      }, 300);
    }, 300);
  }

  public onEnter(): void {}

  public onLeave(): void {
    // this.card.open = false;
  }
}
