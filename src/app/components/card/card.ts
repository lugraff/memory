import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { emptyVector2 } from 'src/app/models/emptyModels';
import { Vector2 } from 'src/app/models/models';
import { LimitNumber } from 'src/app/pipes/limit-number.pipe';
import { MachineInfoService } from 'src/app/services/machine-info-service';
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
  private detector = inject(ChangeDetectorRef);
  private machine = inject(MachineInfoService);

  @Input() public cardId = -1;

  private subs: Subscription[] = [];

  public animOpenStarted = signal(false);
  public animCloseStarted = signal(false);
  public activeScale = signal(1);
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
      { allowSignalWrites: true },
    );
  }

  public onDown(event: PointerEvent): void {
    this.store.setCardIndex(this.cardId);
    this.activeScale.set(1.1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.store.setCardRotation({ cardId: this.cardId, newRotation: (Math.random() - 0.5) * 9 });
      this.onStartMove(event);
    }
  }

  public onDoubleClick(): void {
    if (this.machine.isTouch) {
      this.onAction();
    }
  }

  public onClick(event: MouseEvent): void {
    if (!this.machine.isTouch) {
      if (event.button === 0) {
        this.onAction();
      }
    }
  }

  private onAction(): void {
    if (this.store.lastOpenedCardIdsS().includes(this.cardId)) {
      return;
    }
    this.activeScale.set(1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.store.setCardRotation({ cardId: this.cardId, newRotation: (Math.random() - 0.5) * 9 });
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
        this.detector.detectChanges();
      }, 0);
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
            for (const card of this.store.cardsS()) {
              if (!card.open) {
                this.nextPlayerAnimation();
                return;
              }
            }
            this.store.startOutroAnimation();
          }, 300);
        }
      }, 300);
    }, 300);
  }

  private nextPlayerAnimation(): void {
    setTimeout(() => {
      this.store.setCircleStatus('scale-x-0');
      setTimeout(() => {
        this.store.setCircleStatus('');
        this.store.resetlastOpenedCardIds();
        this.store.nextRound();
        this.store.nextPlayer();
      }, 300);
    }, 500);
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
    if (event !== undefined && event.button !== 0) {
      this.store.setCardDuration({ cardId: this.cardId, newDuration: 0 });
      window.getSelection()?.removeAllRanges();
      this.subs.push(this.pointerEvents.mouseMove$.subscribe((event) => this.onMove(event)));
      this.subs.push(this.pointerEvents.mouseUp$.subscribe(() => this.onEnd()));
      this.moveOffset.set({ x: event.offsetX, y: event.offsetY });
    }
  }

  public onMove(event: MouseEvent | undefined): void {
    if (this.store.cardsS()[this.cardId].duration > 0 || event === undefined) {
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
    this.store.setCardDuration({ cardId: this.cardId, newDuration: 200 });
    this.activeScale.set(1);
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onShowSource() {
    const sourceUrl = this.store.cardsS()[this.cardId].picture.sourceUrl;
    if (sourceUrl && sourceUrl !== '') {
      window.open(this.store.cardsS()[this.cardId].picture.sourceUrl, '_blank');
    }
  }
}
