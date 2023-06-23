import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, debounceTime, flatMap, switchMap } from 'rxjs';
import { emptyVector2 } from 'src/app/models/emptyModels';
import { Vector2 } from 'src/app/models/models';
import { LimitNumber } from 'src/app/pipes/limit-number.pipe';
import { PointerEventService } from 'src/app/services/pointer-events-service';
import { MemoryStore } from 'src/app/stores/memory-store';

@Component({
  selector: 'app-card',
  imports: [CommonModule, FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
})
export class CardComponent {
  public store = inject(MemoryStore);
  private pointerEvents = inject(PointerEventService);
  private limit = inject(LimitNumber);

  @Input() public id = -1;

  private subs: Subscription[] = [];

  public animOpenStarted = signal(false);
  public animCloseStarted = signal(false);
  public randomRotate = signal((Math.random() - 0.5) * 9);
  public activeScale = signal(1);
  public moving = signal(false);
  public moveOffset = signal<Vector2>(emptyVector2);

  public onDown(event: PointerEvent): void {
    this.store.setCardIndex(this.id);
    this.activeScale.set(1.1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.randomRotate.set((Math.random() - 0.5) * 9);
      this.onStartMove(event);
    }
  }

  public onDoubleClick() {
    this.activeScale.set(1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.randomRotate.set((Math.random() - 0.5) * 9);
      if (this.store.lastOpenedCardIdsS().length < 2) {
        if (this.store.cardsS()[this.id].open) {
          this.CloseAnimation();
        } else {
          this.OpenAnimation();
        }
      }
    }
  }

  public onLeave(): void {
    this.activeScale.set(1);
  }

  private OpenAnimation(): void {
    this.animOpenStarted.set(true);
    setTimeout(() => {
      this.store.setCardOpenOrClosed({ cardId: this.id, openOrClosed: true });
      this.store.addlastOpenedCardIds(this.id);
      setTimeout(() => {
        this.animOpenStarted.set(false);
        if (this.store.lastOpenedCardIdsS().length === 2) {
          setTimeout(() => {
            if (this.id % 2 !== 0) {
              if (this.store.cardsS()[this.id - 1].open === true) {
                this.store.setCardPosition({ cardId: this.id, newPosition: this.store.cardsS()[this.id - 1].position });
              } else {
                this.store.setCardOpenOrClosed({ cardId: this.store.lastOpenedCardIdsS()[0], openOrClosed: false });
                this.store.setCardOpenOrClosed({ cardId: this.store.lastOpenedCardIdsS()[1], openOrClosed: false });
                // this.CloseAnimation();
              }
            } else {
              if (this.store.cardsS()[this.id + 1].open === true) {
                this.store.setCardPosition({ cardId: this.id, newPosition: this.store.cardsS()[this.id + 1].position });
              } else {
                this.store.setCardOpenOrClosed({ cardId: this.store.lastOpenedCardIdsS()[0], openOrClosed: false });
                this.store.setCardOpenOrClosed({ cardId: this.store.lastOpenedCardIdsS()[1], openOrClosed: false });
                // this.CloseAnimation();
              }
            }
            this.store.resetlastOpenedCardIds();
          }, 300);
        }
      }, 300);
    }, 300);
  }

  private CloseAnimation(): void {
    this.animCloseStarted.set(true);
    setTimeout(() => {
      this.store.setCardOpenOrClosed({ cardId: this.id, openOrClosed: false });
      setTimeout(() => {
        this.animCloseStarted.set(false);
      }, 300);
    }, 300);
  }

  public onStartMove(event: MouseEvent | undefined): void {
    if (event !== undefined) {
      this.moving.set(true);
      window.getSelection()?.removeAllRanges();
      this.subs.push(this.pointerEvents.mouseMove$.subscribe((event) => this.onMove(event)));
      this.subs.push(this.pointerEvents.mouseUp$.subscribe(() => this.onEnd()));
      this.moveOffset.set({ x: event.offsetX, y: event.offsetY });
    }
  }

  public onMove(event: MouseEvent | undefined): void {
    if (!this.moving() || event === undefined) {
      return;
    }
    let newX = event.clientX - this.moveOffset().x;
    let newY = event.clientY - this.moveOffset().y;
    newX = this.limit.transform(newX, 0, window.innerWidth - this.store.cardsS()[this.id].size.x);
    newY = this.limit.transform(newY, 0, window.innerHeight - this.store.cardsS()[this.id].size.y);
    this.store.setCardPosition({ cardId: this.id, newPosition: { x: newX, y: newY } });
  }

  public onEnd(): void {
    window.getSelection()?.removeAllRanges();
    this.moving.set(false);
    this.activeScale.set(1);
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
