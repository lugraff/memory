import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { LimitNumber } from './app/pipes/limit-number.pipe';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [LimitNumber, importProvidersFrom([HttpClientModule])],
}).catch((err) => console.error(err));
