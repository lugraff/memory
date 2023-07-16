import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemoryStore } from '../../stores/memory-store';
import { CardComponent } from '../card/card';
import { StandardButtonComponent } from '../buttons/standard/standard-button.component';
import { InputNumberComponent } from '../inputs/input-number/input-number.component';
import { setFullScreen, toggleFullScreen } from 'src/app/utils/screen-settings';
import { ReplaySubject } from 'rxjs';
import { MachineInfoService } from 'src/app/services/machine-info-service';
import { InputCheckboxComponent } from '../inputs/input-checkbox/input-checkbox.component';

@Component({
  selector: 'app-memory-game',
  providers: [MemoryStore],
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
    CardComponent,
    StandardButtonComponent,
    InputNumberComponent,
    InputCheckboxComponent,
  ],
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
        toggleFullScreen();
        break;
      default:
        break;
    }
  }

  //TODO Refactoring
  //TODO Window Resize Response
  //TODO Player Creation (Color, Name)
  //TODO KI Creation (Color, Level)
  //TODO Punkte Vergleichs Anzeige
  //TODO KI Modes
  //TODO local StateStore
  //TODO Touch Control multitouch?
  //TODO Musik & SFX
  //TODO Settings (Fullscreen, musik, sfx, )
  //TODO Card-Editor
  //TODO PictureList Importer & UrlLoader
  //TODO Backboard(Background)

  onStartGame() {
    if (this.machineInfo.isMobile) {
      setFullScreen(true);
    }
    this.store.generateNewGame({
      cardAmount: this.inputCardCount,
      playerCount: this.inputPlayerCount,
      kiCount: this.inputKiCount,
      boardSize: { x: innerWidth, y: innerHeight },
    });
    this.introAnimation();
  }

  private introAnimation(): void {
    this.store.resetlastOpenedCardIds();
    this.store.setCircleStatus('intro');
    setTimeout(() => {
      this.store.setCirclePos({ x: innerWidth - 132, y: innerHeight - 132 });
      this.store.setCircleScale(0.5);
      this.store.setCircleStatus('');
      if (this.store.playerS()[this.store.actualPlayerIdS()].ki) {
        this.store.playKiTurn();
      }
    }, 1500);
  }

  public onCheckBoxChange(checked: boolean): void {
    this.store.setPlayAgainMode(checked);
  }

  public onResetGame(): void {
    if (this.store.circleStatusS() === 'gameFinish') {
      this.store.setCircleStatus('');
      this.store.setStatus('menu');
      setFullScreen(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
