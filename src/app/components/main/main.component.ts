import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="w-full h-full grid justify-center items-center">
    <button (click)="onPlayMemory()">Memory</button>
  </div>`,
})
export class MainComponent {
  private router = inject(Router);

  onPlayMemory() {
    this.router.navigate(['memory']);
  }
}
