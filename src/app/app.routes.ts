import {Routes} from '@angular/router';
import {LandingComponent} from "./shared/components/landing-page/landing-page.component";
import {ProfileComponent} from "./features/settings/profile/profile.component";
import {roleGuard} from "./core/guards/role.guard";
import {authGuard} from "./core/guards/auth.guard";
import {HomeComponent} from "./features/home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['participant', 'collector']
        }
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [authGuard]
  }
];
