import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {LogoComponent} from "../logo/logo.component";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  logout() {
    this.authService.logout();
  }
}
