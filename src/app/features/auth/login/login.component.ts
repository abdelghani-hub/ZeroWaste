import {Component, inject} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService, LoginRequest} from "../../../core/services/auth.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string | null = null;

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const credentials: LoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      try {
        const success = await this.authService.login(credentials);
        if (success) {
          let routeTo = this.authService.getCurrentUser?.role === "collector" ? '/recycling-service' : '/profile';
          this.router.navigate([routeTo])
            .then(r => r);
        }
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : 'Login failed';
      }
    }
  }

  // Getters for form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


}
