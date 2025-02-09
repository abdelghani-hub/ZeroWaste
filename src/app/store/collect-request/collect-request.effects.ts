import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import * as CollectRequestActions from './collect-request.actions';
import {CollectRequestService} from "../../core/services/collect-request.service";

@Injectable()
export class CollectRequestEffects {

  constructor(
    private actions$: Actions,
    private collectRequestService: CollectRequestService
  ) {
  }

  createRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectRequestActions.createRequest),
      mergeMap((action) =>
          this.collectRequestService.create(action.request).pipe(
            map(request => CollectRequestActions.createRequestSuccess({request})),
            catchError(error => of(CollectRequestActions.createRequestFailure({error: error.message})))
          )
      )
    );
  });

  loadUserRequests$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectRequestActions.loadUserRequests),
      mergeMap((action) =>
        this.collectRequestService.getUserRequests(action.userId).pipe(
          map(requests => CollectRequestActions.loadUserRequestsSuccess({requests})),
          catchError(error => of(CollectRequestActions.loadUserRequestsFailure({error: error.message})))
        )
      )
    );
  });

  updateRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectRequestActions.updateRequest),
      mergeMap((action) =>
        this.collectRequestService.update(action.id, action.request).pipe(
          map(request => CollectRequestActions.updateRequestSuccess({request})),
          catchError(error => of(CollectRequestActions.updateRequestFailure({error: error.message})))
        )
      )
    );
  });

  deleteRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CollectRequestActions.deleteRequest),
      mergeMap((action) =>
        this.collectRequestService.delete(action.id).pipe(
          map(() => CollectRequestActions.deleteRequestSuccess({id: action.id})),
          catchError(error => of(CollectRequestActions.deleteRequestFailure({error: error.message})))
        )
      )
    );
  });
}
