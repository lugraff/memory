import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { CardComponent } from '../card/card';
import { StandardButtonComponent } from '../buttons/standard/standard-button.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { setFullscreen } from 'src/app/utils/screen-settings';

@Component({
  selector: 'app-memory-game',
  imports: [CommonModule, FormsModule, NgOptimizedImage, CardComponent, StandardButtonComponent, InputNumberComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memory-game.html',
})
export class MemoryGameComponent implements OnInit {
  public store = inject(StoreService);

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

  ngOnInit(): void {}

  onStartGame() {
    this.store.generateNewGame(this.inputCardCount, { x: innerWidth, y: innerHeight });
    setFullscreen();
  }
}
