import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StandardButtonComponent } from '../buttons/standard/standard-button.component';

@Component({
  selector: 'app-main',
  imports: [StandardButtonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="w-full h-full grid justify-center items-center">
    <button
      standard
      (click)="onPlayMemory()">
      Memory
    </button>
  </div>`,
})
export class MainComponent {
  private router = inject(Router);

  onPlayMemory() {
    this.router.navigate(['memory']);
  }
}
