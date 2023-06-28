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
import { GameSettings } from 'src/app/models/models';
import { MachineInfoService } from 'src/app/services/machine-info-service';

@Component({
  selector: 'app-memory-game',
  providers: [MemoryStore],
  imports: [CommonModule, FormsModule, NgOptimizedImage, CardComponent, StandardButtonComponent, InputNumberComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memory-game.html',
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  public store = inject(MemoryStore);
  public machineInfo = inject(MachineInfoService);
  private destroy$ = new ReplaySubject<boolean>(1);

  public inputCardCount = 18;
  public inputPlayerCount = 1;
  public inputKiCount = 0;

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

  ngOnInit(): void {}

  onStartGame() {
    this.store.generateNewGame({
      cardAmount: this.inputCardCount,
      playerCount: this.inputPlayerCount,
      kiCount: this.inputKiCount,
      boardSize: { x: innerWidth, y: innerHeight },
    });
    if (this.machineInfo.isMobile) {
      setFullscreen();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
