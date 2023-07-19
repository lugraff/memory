import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  selector: 'global-input-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-checkbox.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputCheckboxComponent), multi: true }],
})
export class InputCheckboxComponent implements ControlValueAccessor, OnInit {
  @ViewChild('InputField') inputField!: ElementRef;
  @Input() public id = '';
  @Input() public autofocus = false;
  @Input() public checked = false;
  @Input() public disabled = false;
  @Output() public whenChanged = new EventEmitter<boolean>();

  public hover = false; //TODO Signals

  public ngOnInit(): void {
    if (this.autofocus) {
      setTimeout(() => {
        this.inputField.nativeElement.focus();
      }, 100);
    }
  }

  onEnter() {
    this.hover = true;
  }

  onLeave() {
    this.hover = false;
  }

  public onChange: any = () => {
    // 
  };

  public onTouched: any = () => {
    // 
  };

  public onToggle() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.whenChanged.emit(this.checked);
  }

  public writeValue(obj: any): void {
    this.checked = obj;
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onGetFocus(): void {
    this.inputField?.nativeElement.select();
  }
}
