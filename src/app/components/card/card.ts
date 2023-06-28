import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  @Input() public cardId = -1;

  private subs: Subscription[] = [];

  public animOpenStarted = signal(false);
  public animCloseStarted = signal(false);
  public randomRotate = signal((Math.random() - 0.5) * 9);
  public activeScale = signal(1);
  public moving = signal(false);
  public moveOffset = signal<Vector2>(emptyVector2);

  constructor() {
    effect(
      () => {
        for (const card of this.store.cardsS()) {
          if (card.id === this.cardId) {
            if (card.signal === 'close') {
              this.closeAnimation();
              this.store.setCardSignal({ cardId: this.cardId, signal: '' });
            }
            break;
          }
        }
      },
      { allowSignalWrites: true }
    );
  }

  public onDown(event: PointerEvent): void {
    this.store.setCardIndex(this.cardId);
    this.activeScale.set(1.1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.randomRotate.set((Math.random() - 0.5) * 9);
      this.onStartMove(event);
    }
  }

  public onDoubleClick() {
    if (this.store.lastOpenedCardIdsS().includes(this.cardId)) {
      return;
    }
    this.activeScale.set(1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.randomRotate.set((Math.random() - 0.5) * 9);
      if (this.store.lastOpenedCardIdsS().length < 2) {
        if (this.store.cardsS()[this.cardId].open) {
          //this.CloseAnimation();
        } else {
          this.openAnimation();
        }
      }
    }
  }

  public onLeave(): void {
    this.activeScale.set(1);
  }

  private openAnimation(): void {
    this.animOpenStarted.set(true);
    setTimeout(() => {
      this.store.setCardOpenOrClosed({ cardId: this.cardId, openOrClosed: true });
      this.store.addlastOpenedCardIds(this.cardId);
      setTimeout(() => {
        this.animOpenStarted.set(false);
        if (this.store.lastOpenedCardIdsS().length === 2) {
          setTimeout(() => {
            if (this.cardId % 2 !== 0) {
              if (this.store.cardsS()[this.cardId - 1].open === true) {
                this.store.setCardPosition({
                  cardId: this.cardId,
                  newPosition: this.store.cardsS()[this.cardId - 1].position,
                });
                this.store.addPoint(this.store.actualPlayerIdS());
              } else {
                this.store.setCardSignal({ cardId: this.store.lastOpenedCardIdsS()[0], signal: 'close' });
                this.closeAnimation();
              }
            } else {
              if (this.store.cardsS()[this.cardId + 1].open === true) {
                this.store.setCardPosition({
                  cardId: this.cardId,
                  newPosition: this.store.cardsS()[this.cardId + 1].position,
                });
                this.store.addPoint(this.store.actualPlayerIdS());
              } else {
                this.store.setCardSignal({ cardId: this.store.lastOpenedCardIdsS()[0], signal: 'close' });
                this.closeAnimation();
              }
            }
            this.store.resetlastOpenedCardIds();
            this.store.nextRound();
            this.store.nextPlayer();
          }, 300);
        }
      }, 300);
    }, 300);
  }

  public closeAnimation(): void {
    this.animCloseStarted.set(true);
    setTimeout(() => {
      this.store.setCardOpenOrClosed({ cardId: this.cardId, openOrClosed: false });
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
    newX = this.limit.transform(newX, 16, window.innerWidth - this.store.cardsS()[this.cardId].size.x - 16);
    newY = this.limit.transform(newY, 16, window.innerHeight - this.store.cardsS()[this.cardId].size.y - 16);
    this.store.setCardPosition({ cardId: this.cardId, newPosition: { x: newX, y: newY } });
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
