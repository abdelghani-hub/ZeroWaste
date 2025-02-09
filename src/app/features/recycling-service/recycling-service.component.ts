import {Component} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {CollectRequest} from "../../core/models/collectRequest.model";
import {CollectRequestState} from "../../store/collect-request/collect-request.reducer";
import {Store} from "@ngrx/store";
import {loadCollectorRequests, updateRequestStatus} from "../../store/collect-request/collect-request.actions";
import {NotificationUtil} from "../../core/utils/NotificationUtil";
import {DateAgoPipe} from "../../shared/pipes/date-ago.pipe";
import {StatusSelectComponent} from "../../shared/components/status-select/status-select.component";

@Component({
  selector: 'app-recycling-service',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    DateAgoPipe,
    StatusSelectComponent
  ],
  templateUrl: './recycling-service.component.html',
})
export class RecyclingServiceComponent {

  private requests: CollectRequest[];
  constructor(
    private store: Store<{ collectRequest: CollectRequestState }>) {
    this.requests = [];
    this.loadRequests();
  }

  private loadRequests() {
    this.store.dispatch(loadCollectorRequests());
    this.store.select(state => state.collectRequest).subscribe(
      state => {
        if (state.error) {
          NotificationUtil.error(state.error.toString());
        } else {
          this.requests = state.requests;
        }
      }
    );
  }

  randomAvatar() {
    // return a random letter in upper case
    return 'A'
  }

  get collectorRequests() {
    return this.requests;
  }

  onStatusChange(newStatus: string, requestId: string) {
    this.store.dispatch(updateRequestStatus({ requestId, status: newStatus }));
  }
}
