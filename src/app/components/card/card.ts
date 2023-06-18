import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
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

  @Input() public id = -1;

  public animOpenStarted = signal(false);
  public animCloseStarted = signal(false);

  public onDown(): void {
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      if (this.store.cards()[this.id].open) {
        this.CloseAnimation();
      } else {
        this.OpenAnimation();
      }
    }
  }

  private OpenAnimation(): void {
    this.animOpenStarted.set(true);
    setTimeout(() => {
      this.store.cards.mutate((cards) => (cards[this.id].open = true));
      setTimeout(() => {
        this.animOpenStarted.set(false);
      }, 300);
    }, 300);
  }

  private CloseAnimation(): void {
    this.animCloseStarted.set(true);
    setTimeout(() => {
      this.store.cards.mutate((cards) => (cards[this.id].open = false));
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
