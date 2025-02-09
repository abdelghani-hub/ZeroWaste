// header.component.ts
import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {LogoComponent} from "../logo/logo.component";
import {AuthService} from "../../../core/services/auth.service";
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(event: Event) {
    // Close dropdown when clicking outside
    if (!(event.target as HTMLElement).closest('.profile-dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  // Add this in the class
  ngOnInit() {
    // Add click listener to close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdown.bind(this));
  }

  ngOnDestroy() {
    // Remove listener when component is destroyed
    document.removeEventListener('click', this.closeDropdown.bind(this));
  }

  // Toggle dark mode in your component
  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }
}
