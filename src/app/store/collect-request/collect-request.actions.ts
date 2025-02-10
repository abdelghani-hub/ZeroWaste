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

export const loadCollectorRequests = createAction(
    '[Collect Request] Load Collector Requests'
);

export const loadCollectorRequestsSuccess = createAction(
    '[Collect Request] Load Collector Requests Success',
    props<{ requests: CollectRequest[] }>()
);
export const loadCollectorRequestsFailure = createAction(
    '[Collect Request] Load Collector Requests Failure',
    props<{ error: string }>()
);

export const updateRequestStatus = createAction(
    '[Collect Request] Update Status',
    props<{ requestId: string; status: string }>()
);
export const updateRequestStatusSuccess = createAction(
    '[Collect Request] Update Status Success',
    props<{ request: CollectRequest }>()
);
export const updateRequestStatusFailure = createAction(
    '[Collect Request] Update Status Failure',
    props<{ error: string }>()
);

export const assignCollector = createAction(
    '[Collect Request] Assign Collector',
    props<{ requestId: string; collectorId: string }>()
);
export const assignCollectorSuccess = createAction(
    '[Collect Request] Assign Collector Success',
    props<{ request: CollectRequest }>()
);
export const assignCollectorFailure = createAction(
    '[Collect Request] Assign Collector Failure',
    props<{ error: string }>()
);
