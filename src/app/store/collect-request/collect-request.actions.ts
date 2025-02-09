import {createAction, props} from '@ngrx/store';
import {CollectRequest} from '../../core/models/collectRequest.model';

export const createRequest = createAction(
  '[Collect Request] Create Request',
  props<{ request: Partial<CollectRequest> }>()
);

export const createRequestSuccess = createAction(
  '[Collect Request] Create Request Success',
  props<{ request: CollectRequest }>()
);

export const createRequestFailure = createAction(
  '[Collect Request] Create Request Failure',
  props<{ error: string }>()
);

export const loadUserRequests = createAction(
  '[Collect Request] Load User Requests',
  props<{ userId: string | undefined }>()
);

export const loadUserRequestsSuccess = createAction(
  '[Collect Request] Load User Requests Success',
  props<{ requests: CollectRequest[] }>()
);

export const loadUserRequestsFailure = createAction(
  '[Collect Request] Load User Requests Failure',
  props<{ error: string }>()
);

export const updateRequest = createAction(
  '[Collect Request] Update Request',
  props<{ id: string; request: Partial<CollectRequest> }>()
);

export const updateRequestSuccess = createAction(
  '[Collect Request] Update Request Success',
  props<{ request: CollectRequest }>()
);

export const updateRequestFailure = createAction(
  '[Collect Request] Update Request Failure',
  props<{ error: string }>()
);

export const deleteRequest = createAction(
  '[Collect Request] Delete Request',
  props<{ id: string }>()
);

export const deleteRequestSuccess = createAction(
  '[Collect Request] Delete Request Success',
  props<{ id: string }>()
);

export const deleteRequestFailure = createAction(
  '[Collect Request] Delete Request Failure',
  props<{ error: string }>()
);
