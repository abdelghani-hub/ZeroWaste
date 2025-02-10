import {Component, inject} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {AuthService, RegisterRequest} from "../../../core/services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {LogoComponent} from "../../../shared/components/logo/logo.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgStyle,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    NgClass,
    LogoComponent
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string | null = null;
  loading: boolean = false;

  registerForm = inject(FormBuilder).group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^(05|06|07|08)[0-9]{8}$')]],
      birthDate: ['', [Validators.required, this.birthDateValidator]],
    },
    {validators: this.passwordMatchValidator});

  // On submit
  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      // Register user;
      const user: RegisterRequest = {
        email: this.email?.value,
        password: this.password?.value,
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
        address: this.address?.value,
        phone: this.phone?.value,
        birthDate: this.birthDate?.value,
      };
      this.authService.register(user)
        .then(() => {
          this.authService.login({email: user.email, password: user.password})
            .then(() => {
              this.router.navigate(['/profile'])
                .then(r => r);
            });
        })
        .catch(error => {
          this.errorMessage = error;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }


  // Validators
  private passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {passwordMismatch: true};
  }

  private birthDateValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age >= 18 ? null : {underage: true};
  }

  // Getters for form controls
  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get birthDate() {
    return this.registerForm.get('birthDate');
  }
}
