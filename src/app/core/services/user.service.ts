import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {
  }

  /**
   * find user by id
   */
  findUserById(id: string | undefined): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}

