import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {provideStore} from '@ngrx/store';
import {collectRequestReducer} from "./store/collect-request/collect-request.reducer";
import {provideEffects} from "@ngrx/effects";
import {CollectRequestEffects} from "./store/collect-request/collect-request.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ collectRequest: collectRequestReducer }),
    provideEffects(CollectRequestEffects)
  ]
};
