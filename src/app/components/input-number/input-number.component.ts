import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  Directive,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { StandardButtonComponent } from '../buttons/standard/standard-button.component';

@Directive({
  selector: '[globalOnlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective implements AfterViewInit {
  @Input() public IntegerMode = true;
  @Output() public valueChangedByOnlyNumbers = new EventEmitter<number>();

  regexStr = /[^0-9.,]*/g;

  constructor(private el: ElementRef) {}
  ngAfterViewInit(): void {
    if (!this.IntegerMode) {
      // this.regexStr = /[\D,]*/g;
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Escape' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'F5' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.ctrlKey ||
      event.metaKey
    ) {
      // allow keydown events for special keys
      return;
    }
    const elementValue = this.el.nativeElement.value;
    const canAddCommaOrPoint =
      !this.IntegerMode && elementValue.indexOf(',') === -1 && elementValue.indexOf('.') === -1;

    // prevent keydown events that are not numbers
    if (
      event.key !== '0' &&
      event.key !== '1' &&
      event.key !== '2' &&
      event.key !== '3' &&
      event.key !== '4' &&
      event.key !== '5' &&
      event.key !== '6' &&
      event.key !== '7' &&
      event.key !== '8' &&
      event.key !== '9' &&
      event.key !== '-' &&
      (!canAddCommaOrPoint || event.key !== ',') &&
      (!canAddCommaOrPoint || event.key !== '.')
    ) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
      return;
    }
    const pastedData = clipboardData.getData('text');
    if (!isNumeric(pastedData)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    let initialValue = this.el.nativeElement.value;
    if (initialValue.startsWith('-')) {
      initialValue = '-' + initialValue.substring(1).replace(this.regexStr, '');
    } else {
      initialValue = initialValue.replace(this.regexStr, '');
    }
    const wasEmpty = initialValue === '';
    if (wasEmpty) {
      initialValue = '0';
    }
    initialValue = initialValue.replace(',', '.');
    this.el.nativeElement.value = initialValue;
    this.valueChangedByOnlyNumbers.emit(this.parseNumber(initialValue));
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
    if (wasEmpty) {
      this.el.nativeElement.select();
    }
  }
  parseNumber(value: string): number {
    if (value === '') {
      return 0;
    }
    if (this.IntegerMode) {
      return parseInt(value);
    }
    return parseFloat(value);
  }
}

@Component({
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, StandardButtonComponent, OnlyNumbersDirective],
  selector: 'global-input-number',
  templateUrl: './input-number.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputNumberComponent), multi: true }],
})
export class InputNumberComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('InputField') inputField!: ElementRef;
  @Input() public inputType = 'int';
  @Input() public inputText = '';
  @Input() public selectAllOnFocus = false;
  @Input() public readonly = false;
  @Input() public autofocus = false;
  @Input() public disabled = false;
  @Input() public step = 1;
  @Input() public min?: number = undefined;
  @Input() public max?: number = undefined;
  @Input() public inputFieldWidth = '';
  @Output() public inputTextOutput = new EventEmitter<string>();
  @Output() public inputTextChange = new EventEmitter<string>();
  @Output() public enterPressed = new EventEmitter<void>();
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enterPressed.emit();
    }
  }

  public ngAfterViewInit(): void {
    if (this.autofocus) {
      this.inputField.nativeElement.focus();
    }
  }

  public onChange: any = () => {
    this.inputTextChange.emit(this.inputText);
  };

  public onTouched: any = () => {
    /**/
  };

  public valueChanged(value: number) {
    this.inputText = value.toString();
    this.onChange(this.inputText);
    const newValue = this.checkMinMax(this.inputText);
    if (newValue !== '') {
      setTimeout(() => {
        this.inputText = newValue;
        this.onChange(this.inputText);
        this.emitInputText();
      });
    }
  }

  public emitInputText(): void {
    this.inputTextOutput.emit(this.inputText);
  }

  public writeValue(obj: any): void {
    this.inputText = obj;
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
    if (this.selectAllOnFocus) {
      this.inputField?.nativeElement.select();
    }
  }

  private checkMinMax(oldValue: string): string {
    if (this.max !== undefined && this.parseNumber(oldValue) > this.max) {
      return this.max.toString();
    }

    if (this.min !== undefined && this.parseNumber(oldValue) < this.min) {
      return this.min.toString();
    }

    return '';
  }
  parseNumber(value: string): number {
    if (value === '') {
      return 0;
    }
    if (this.inputType === 'number') {
      return parseFloat(value);
    }

    return parseInt(value);
  }

  onIncrement() {
    if (this.step && this.step !== 0) {
      let parsedValue = this.parseNumber(this.inputText);
      if (parsedValue.toString() === 'NaN') {
        parsedValue = 0;
      }

      this.inputText = (parsedValue + this.step).toString();
      const newValue = this.checkMinMax(this.inputText);
      if (newValue !== '') {
        this.inputText = newValue;
      }

      this.onChange(this.inputText);
    }
  }

  onDecrement() {
    if (this.step && this.step !== 0) {
      this.inputText = (this.parseNumber(this.inputText) - this.step).toString();
      const newValue = this.checkMinMax(this.inputText);
      if (newValue !== '') {
        this.inputText = newValue;
      }
      this.onChange(this.inputText);
    }
  }
}

function isNumeric(value: string): boolean {
  return /^-?[\d.]+$/.test(value);
}
