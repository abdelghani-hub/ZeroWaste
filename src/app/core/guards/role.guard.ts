import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const roleGuard: CanActivateFn = (route, state): true | false => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUserRole = authService.getCurrentUser?.role;

  if (!currentUserRole) {
    router.navigate(['/auth/login']).then(r => r);
    return false;
  }

  const allowedRoles = route.data?.['roles'];
  if (!allowedRoles) {
    router.navigate(['/auth/login']).then(r => r);
    return false;
  }

  if (!allowedRoles.includes(currentUserRole)) {
    router.navigate(['/auth/login']).then(r => r);
    return false;
  }

  return true;
};
