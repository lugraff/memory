import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MachineInfoService } from './machine-info-service';

@Injectable({
  providedIn: 'root',
})
export class PointerEventService {
  private mouseLastEvent = new BehaviorSubject<MouseEvent | undefined>(undefined);
  public mouseLastEvent$ = this.mouseLastEvent.asObservable().pipe();
  private mouseMove = new Subject<MouseEvent>();
  public mouseMove$ = this.mouseMove.asObservable().pipe();
  private mouseUp = new Subject<MouseEvent>();
  public mouseUp$ = this.mouseUp.asObservable().pipe();
  private mouseDown = new Subject<MouseEvent>();
  public mouseDown$ = this.mouseDown.asObservable().pipe();

  constructor(public machineInfoService: MachineInfoService) {
    if (machineInfoService.isMobile) {
      window.addEventListener('touchstart', (event) => {
        const emulatedEvent: MouseEvent = new MouseEvent('mouseDown', this.emulateEvent(event.changedTouches[0]));
        this.mouseDown.next(emulatedEvent);
        this.mouseLastEvent.next(emulatedEvent);
      });
      window.addEventListener('touchmove', (event) => {
        const emulatedEvent: MouseEvent = new MouseEvent('mousemove', this.emulateEvent(event.changedTouches[0]));
        this.mouseMove.next(emulatedEvent);
        this.mouseLastEvent.next(emulatedEvent);
      });
      window.addEventListener('touchend', (event) => {
        const emulatedEvent: MouseEvent = new MouseEvent('mouseup', this.emulateEvent(event.changedTouches[0]));
        this.mouseUp.next(emulatedEvent);
        this.mouseLastEvent.next(emulatedEvent);
      });
    } else {
      window.addEventListener('mousedown', (event) => {
        this.mouseDown.next(event);
        this.mouseLastEvent.next(event);
      });
      window.addEventListener('mousemove', (event) => {
        this.mouseMove.next(event);
        this.mouseLastEvent.next(event);
      });
      window.addEventListener('mouseup', (event) => {
        this.mouseUp.next(event);
        this.mouseLastEvent.next(event);
      });
    }
  }

  private emulateEvent(touch: Touch): MouseEventInit {
    const emulatedEvent: MouseEventInit = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      relatedTarget: touch.target,
      screenX: touch.screenX,
      screenY: touch.screenY,
    };
    return emulatedEvent;
  }
}
