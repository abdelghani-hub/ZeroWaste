import {createReducer, on} from '@ngrx/store';
import {CollectRequest} from '../../core/models/collectRequest.model';
import * as CollectRequestActions from './collect-request.actions';

export interface CollectRequestState {
  requests: CollectRequest[];
  loading: boolean;
  error: string | null;
}

export const initialState: CollectRequestState = {
  requests: [],
  loading: false,
  error: null
};

export const collectRequestReducer = createReducer(
  initialState,

  on(CollectRequestActions.createRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CollectRequestActions.createRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
    loading: false
  })),

  on(CollectRequestActions.createRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(CollectRequestActions.loadUserRequests, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CollectRequestActions.loadUserRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false
  })),

  on(CollectRequestActions.loadUserRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(CollectRequestActions.updateRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map(r => r.id === request.id ? request : r),
    loading: false
  })),

  on(CollectRequestActions.deleteRequestSuccess, (state, { id }) => ({
    ...state,
    requests: state.requests.filter(r => r.id !== id),
    loading: false
  }))
);
