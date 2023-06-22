import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemoryStore } from '../../stores/memory-store';
import { CardComponent } from '../card/card';
import { StandardButtonComponent } from '../buttons/standard/standard-button.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { setFullscreen } from 'src/app/utils/screen-settings';
import { PointerEventService } from 'src/app/services/pointer-events-service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-memory-game',
  imports: [CommonModule, FormsModule, NgOptimizedImage, CardComponent, StandardButtonComponent, InputNumberComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memory-game.html',
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  public store = inject(MemoryStore);
  private pointerEvents = inject(PointerEventService);
  private destroy$ = new ReplaySubject<boolean>(1);

  public inputCardCount = 18;
  public inputPlayerCount = 1;
  public inputNPCCount = 0;

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(event.code);
    switch (event.code) {
      case 'KeyF':
        setFullscreen();
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.pointerEvents.mouseDown$.pipe(takeUntil(this.destroy$)).subscribe((newEvent) => {
      console.log(newEvent);
    });
  }

  onStartGame() {
    this.store.generateNewGame(this.inputCardCount, { x: innerWidth, y: innerHeight });
    setFullscreen();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
