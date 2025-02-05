import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const currentUser= authService.getCurrentUser;
  if (currentUser) {
    return router.navigate(
      ['/profile']
    ).then(r => {
      return false;
    });
  }

  return true;
};
