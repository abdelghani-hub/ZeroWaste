import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CollectRequestCreateComponent} from "../../collect-request/create/collect-request-create.component";
import {CollectRequest} from "../../../core/models/collectRequest.model";
import {CollectRequestService} from "../../../core/services/collect-request.service";
import {AuthenticatedUser, AuthService} from "../../../core/services/auth.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    DatePipe,
    NgIf
  ]
})
export class ProfileComponent {
  private userCollectRequests: CollectRequest[] = [];
  private user: AuthenticatedUser | null = null;
  constructor(
    private dialog: MatDialog,
    private collectRequestService: CollectRequestService,
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser;
    collectRequestService.getUserRequests(this.user?.id).subscribe(
      requests => {
        this.userCollectRequests = requests
      }
    );

  }

  openCreateRequestDialog() {
    const dialogRef = this.dialog.open(CollectRequestCreateComponent, {
      width: '80%',
      panelClass: 'custom-dialog-container',
      data: { parent: this }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collectRequestService.getUserRequests(this.user?.id).subscribe(
          requests =>
            this.userCollectRequests = requests.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
        );
      }
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  cancelRequest(id: string) {

  }

  get userRequests() {
    return this.userCollectRequests;
  }
}
