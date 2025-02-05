import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {hashPassword} from '../utils/hasher.util';

// User model interface
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  birthDate: Date;
  role: 'participant' | 'collector';
}

// Request interfaces
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  birthDate: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: 'participant' | 'collector';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // JSON Server URL
  private localStorageKey = 'currentUser';
  private userSubject: BehaviorSubject<AuthenticatedUser | null>;
  public user$: Observable<AuthenticatedUser | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem(this.localStorageKey);
    this.userSubject = new BehaviorSubject<AuthenticatedUser | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.user$ = this.userSubject.asObservable();
  }

  /**
   * Returns the currently authenticated user.
   */
  get getCurrentUser(): AuthenticatedUser | null {
    return this.userSubject.value;
  }

  /**
   * Logs in a user by validating credentials against JSON Server.
   */
  async login(credentials: LoginRequest): Promise<boolean> {
    try {
      const users: User[] | undefined = await this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}`).toPromise();

      if (users?.length === 0) {
        throw new Error('Invalid email or password');
      }

      const hashedPassword = await hashPassword(credentials.password);
      const user = users?.find(u => u.passwordHash === hashedPassword);

      if (user) {
        const authenticatedUser: AuthenticatedUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        };

        localStorage.setItem(this.localStorageKey, JSON.stringify(authenticatedUser));
        this.userSubject.next(authenticatedUser);
        return true;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registers a new user and saves it to JSON Server.
   */
  async register(userData: RegisterRequest): Promise<boolean> {
    try {
      const users: User[] | undefined = await this.http.get<User[]>(`${this.apiUrl}?email=${userData.email}`).toPromise();

      if (users && users.length > 0) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await hashPassword(userData.password);
      const newUser: User = {
        id: this.generateUUID(),
        email: userData.email,
        passwordHash: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        phone: userData.phone,
        birthDate: userData.birthDate,
        role: 'participant'
      };

      console.log('New user:', newUser);

      await this.http.post<User>(this.apiUrl, newUser).toPromise();
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * Logs out the user and clears session storage.
   */
  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.userSubject.next(null);
    this.router.navigate(['/auth/login'])
      .then(r => r);
  }

  /**
   * Checks if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser;
  }

  /**
   * Generate new unique UUID
   */
  generateUUID(): string {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
}

