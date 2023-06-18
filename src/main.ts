import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { LimitNumber } from './app/pipes/force-min-max-pipe';
import { Routes, provideRouter } from '@angular/router';
import { MainComponent } from './app/components/main.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

bootstrapApplication(AppComponent, {
  providers: [LimitNumber, provideRouter(ROUTES), HttpClientModule],
}).catch((err) => console.error(err));
