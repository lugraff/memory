import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, debounceTime, flatMap, switchMap } from 'rxjs';
import { emptyVector2 } from 'src/app/models/emptyModels';
import { Vector2 } from 'src/app/models/models';
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

  @HostBinding('class') public class = 'relative';
  @Input() public id = -1;

  private subs: Subscription[] = [];

  public animOpenStarted = signal(false);
  public animCloseStarted = signal(false);
  public randomRotate = signal((Math.random() - 0.5) * 9);
  public activeScale = signal(1);
  public moving = signal(false);
  public moveOffset = signal<Vector2>(emptyVector2);

  private lastTime = 0;

  public onDown(event: PointerEvent): void {
    this.store.setCardIndex(this.id);
    this.activeScale.set(1.1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.randomRotate.set((Math.random() - 0.5) * 9);
      if (this.store.cardsS()[this.id].open) {
        // this.CloseAnimation();
        this.onStartMove(event);
      } else {
        //
      }
    }
  }

  public onLeave(): void {
    this.activeScale.set(1);
  }

  public onUp(event: PointerEvent): void {
    if (this.activeScale() === 1) {
      return;
    }
    this.activeScale.set(1);
    if (!this.animOpenStarted() && !this.animCloseStarted()) {
      this.randomRotate.set((Math.random() - 0.5) * 9);
      if (this.store.cardsS()[this.id].open) {
        // this.CloseAnimation();
        // this.onStartMove(event);
      } else {
        this.OpenAnimation();
      }
    }
  }

  private OpenAnimation(): void {
    this.animOpenStarted.set(true);
    setTimeout(() => {
      this.store.setCardOpenOrClosed({ cardId: this.id, OpenOrClosed: true });
      setTimeout(() => {
        this.animOpenStarted.set(false);
      }, 300);
    }, 300);
  }

  private CloseAnimation(): void {
    this.animCloseStarted.set(true);
    setTimeout(() => {
      this.store.setCardOpenOrClosed({ cardId: this.id, OpenOrClosed: false });
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
    const newTime = new Date().getTime();
    console.log(newTime - this.lastTime);
    this.lastTime = newTime;
    if (!this.moving() || event === undefined) {
      return;
    }
    const newPosition: Vector2 = {
      x: this.WithinX(event.clientX - this.moveOffset().x, this.store.cardsS()[this.id].size.x),
      y: this.WithinY(event.clientY - this.moveOffset().y, this.store.cardsS()[this.id].size.y),
    };
    this.store.setCardPosition({ cardId: this.id, newPosition: newPosition });
  }

  private WithinX(popupPositionX: number, popupWidth: number): number {
    if (popupPositionX < 0) {
      popupPositionX = 0;
    } else if (popupPositionX > window.innerWidth - popupWidth) {
      popupPositionX = window.innerWidth - popupWidth;
    }
    return popupPositionX;
  }

  private WithinY(popupPositionY: number, popupHeight: number): number {
    if (popupPositionY < 0) {
      popupPositionY = 0;
    } else if (popupPositionY > window.innerHeight - popupHeight) {
      popupPositionY = window.innerHeight - popupHeight;
    }
    return popupPositionY;
  }

  public onEnd(): void {
    window.getSelection()?.removeAllRanges();
    this.moving.set(false);
    this.activeScale.set(1);
    // this.moveIntoViewX();
    // this.moveIntoViewY();
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public onEnter(): void {}
}
