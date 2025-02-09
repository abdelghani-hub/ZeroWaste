import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CollectRequestCreateComponent} from "../../collect-request/create/collect-request-create.component";
import {CollectRequest} from "../../../core/models/collectRequest.model";
import {AuthenticatedUser, AuthService} from "../../../core/services/auth.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CollectRequestState} from "../../../store/collect-request/collect-request.reducer";
import {Store} from "@ngrx/store";
import { loadUserRequests } from '../../../store/collect-request/collect-request.actions';
import { NotificationUtil } from '../../../core/utils/NotificationUtil';

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
  private userCollectRequests: CollectRequest[];
  public user: AuthenticatedUser | null = null;
  constructor(
    private dialog: MatDialog,
    private store: Store<{ collectRequest: CollectRequestState }>,
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser;
    this.loadUserRequests();
    this.userCollectRequests = [];
  }

  openCreateRequestDialog() {
    const dialogRef = this.dialog.open(CollectRequestCreateComponent, {
      width: '80%',
      panelClass: 'custom-dialog-container',
      data: { parent: this }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserRequests();
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

  private loadUserRequests() {
    this.store.dispatch(loadUserRequests({ userId: this.user?.id }));
    this.store.select(state => state.collectRequest).subscribe(
      state => {
        if (state.error) {
          NotificationUtil.error(state.error.toString());
        } else {
          this.userCollectRequests = [...state.requests].sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
        }
      }
    );
  }
}
