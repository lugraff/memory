import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ngIconsRecord, iconList } from './icon-list';
import { getTailwindColorHexCode } from '../utils/tailwind-colors';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons(ngIconsRecord)],
  selector: 'global-icon',
  template: `<div
    *ngIf="icon !== undefined && icon !== ''"
    class="flex">
    <div *ngIf="icon.startsWith('http'); else ngIcon">
      <img
        [ngStyle]="{ width: size }"
        [src]="icon" />
    </div>
    <ng-template #ngIcon>
      <ng-icon
        *ngIf="_icon !== ''"
        [name]="_icon"
        [strokeWidth]="strokeWidth"
        [size]="size"
        [color]="_color"
        class="duration-200">
      </ng-icon>
    </ng-template>
  </div>`,
})
export class IconComponent implements OnChanges {
  @Input() public icon: string | undefined = undefined;
  public _icon = '';
  @Input() public strokeWidth: string | number | undefined = 1.5;
  @Input() public size = '1.5rem';
  @Input() public color = '';
  public _color = '';
  public readonly icons = iconList;

  public ngOnChanges(changes: SimpleChanges): void {
    const changeIcon: SimpleChange = changes['icon'];
    const changeColor: SimpleChange = changes['color'];
    if (changeIcon || changeColor) {
      if (this.icon !== undefined) {
        this._icon = this.iconExists(this.icon);
        this._color = getTailwindColorHexCode(this.color);
      }
    }
  }

  private iconExists(icon: string): string {
    if (this.icons.includes(icon)) {
      return icon;
    }
    this.color = '#646464';
    return 'octQuestion';
  }
}
