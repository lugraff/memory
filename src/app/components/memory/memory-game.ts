import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemoryStore } from '../../stores/memory-store';
import { CardComponent } from '../card/card';
import { StandardButtonComponent } from '../buttons/standard/standard-button.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { setFullscreen } from 'src/app/utils/screen-settings';
import { ReplaySubject } from 'rxjs';
import { MachineInfoService } from 'src/app/services/machine-info-service';

@Component({
  selector: 'app-memory-game',
  providers: [MemoryStore],
  imports: [CommonModule, FormsModule, NgOptimizedImage, CardComponent, StandardButtonComponent, InputNumberComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memory-game.html',
})
export class MemoryGameComponent implements OnDestroy {
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

  //TODO Desktop Controls (left & rightClick) / Touch Control (Double and single + multitouch?)
  //TODO KI Player
  //TODO StateStore
  //TODO Exit Fullscreen
  //TODO Refactoring
  //TODO Musik & SFX
  //TODO Settings (Fullscreen, musik, sfx, )
  //TODO StatusCircle tierchips
  //TODO Card-Editor
  //TODO PictureList Importer & UrlLoader
  //TODO Backboard(Background)

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
    this.introAnimation();
  }

  private introAnimation(): void {
    this.store.resetlastOpenedCardIds();
    this.store.setCircleStatus('intro');
    setTimeout(() => {
      this.store.setCirclePos({ x: innerWidth - 132, y: innerHeight - 132 });
      this.store.setCircleScale(0.5);
      this.store.setCircleStatus('');
    }, 1500);
  }

  public onResetGame(): void {
    if (this.store.circleStatusS() === 'gameFinish') {
      this.store.setCircleStatus('');
      this.store.setStatus('menu');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
