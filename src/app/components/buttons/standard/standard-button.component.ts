import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { IconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  selector: 'button[standard]',
  template: `<div class="flex justify-center items-center gap-2 text-secondary overflow-hidden">
    <global-icon
      *ngIf="icon.length"
      [icon]="icon"
      [strokeWidth]="iconStroke"
      [size]="iconSize"
      [color]="iconColor">
    </global-icon>
    <ng-content></ng-content>
  </div>`,
})
export class StandardButtonComponent implements OnChanges {
  @Input() public selectedButton = false;
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
  private readonly baseClass =
    'select-none disabled:brightness-50 disabled:pointer-events-none outline-none text-center rounded-md bg-bgB hover:border-primary border active:brightness-125 active:border-primary transition-all duration-250';
  private ngClass = ' border-bgB';

  @HostBinding('class') public class = this.baseClass + this.ngClass;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedButton']) {
      const change: SimpleChange = changes['selectedButton'];
      if (change.currentValue !== change.previousValue) {
        if (change.currentValue) {
          this.ngClass = ' border-primary';
        } else {
          this.ngClass = ' border-bgB';
        }
        this.class = this.baseClass + this.ngClass;
      }
    }
  }
}
