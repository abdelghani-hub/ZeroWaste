import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, delay, map, switchMap} from 'rxjs/operators';
import {CollectRequest} from '../models/collectRequest.model';
import CollectRequestStatus from "../enums/CollectRequestStatus";
import {generateUUID} from "../utils/uuidGenerator.util";
import {NotificationUtil} from "../utils/NotificationUtil";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CollectRequestService {
  private apiUrl = 'http://localhost:3000/collectRequests';

  constructor(private http: HttpClient, private authService: AuthService) {}

  create(request: Partial<CollectRequest>): Observable<CollectRequest> {
    return this.getUserRequests(request.userId).pipe(
      map(requests => {
        const pendingRequests = requests.filter(
          req => req.status === CollectRequestStatus.PENDING
        );

        if (pendingRequests.length >= 3) {
          NotificationUtil.warning('You can only have 3 pending requests at a time');
          return null;
        }

        return {
          ...request,
          id: generateUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: CollectRequestStatus.PENDING,
          userId: this.authService.getCurrentUser?.id
        } as CollectRequest;
      }),
      delay(500), // Simulate API delay
      catchError(error => throwError(() => error)),
      switchMap(newRequest => this.http.post<CollectRequest>(this.apiUrl, newRequest))
    );
  }

  update(id: string, request: Partial<CollectRequest>): Observable<CollectRequest> {
    return this.http.get<CollectRequest>(`${this.apiUrl}/${id}`).pipe(
      map(existingRequest => {
        if (!existingRequest) {
          throw new Error('Request not found');
        }

        return {
          ...existingRequest,
          ...request,
          updatedAt: new Date()
        } as CollectRequest;
      }),
      delay(500), // Simulate API delay
      catchError(error => throwError(() => error)),
      switchMap(updatedRequest => this.http.put<CollectRequest>(`${this.apiUrl}/${id}`, updatedRequest))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      delay(500), // Simulate API delay
      catchError(error => throwError(() => error))
    );
  }

  getUserRequests(userId: string | undefined): Observable<CollectRequest[]> {
    return this.http.get<CollectRequest[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      delay(500), // Simulate API delay
      catchError(error => throwError(() => error))
    );
  }
}
