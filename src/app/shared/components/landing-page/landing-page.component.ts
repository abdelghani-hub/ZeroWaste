import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule, HeaderComponent, FooterComponent
  ],
  templateUrl: './landing-page.component.html',
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
