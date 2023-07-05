import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { LimitNumber } from './app/pipes/limit-number.pipe';
import { Routes, provideRouter } from '@angular/router';
import { MemoryGameComponent } from './app/components/memory/memory-game';
import { importProvidersFrom } from '@angular/core';

const ROUTES: Routes = [
  {
    path: '',
    component: MemoryGameComponent,
  },
  {
    path: 'memory',
    component: MemoryGameComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

bootstrapApplication(AppComponent, {
  providers: [LimitNumber, provideRouter(ROUTES), importProvidersFrom([HttpClientModule])],
}).catch((err) => console.error(err));
