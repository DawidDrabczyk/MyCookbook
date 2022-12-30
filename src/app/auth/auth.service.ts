import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private token: string;
  private authStatus = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  createNewUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post('http://localhost:3000/api/auth/signup', authData).subscribe((result) => {
      console.log(result);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string }>('http://localhost:3000/api/auth/login', authData).subscribe((result) => {
      const token = result.token;
      this.token = token;
      if(token){
        this.isAuthenticated = true;
        this.authStatus.next(true);
      }
    });
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  onLogout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatus.next(false);
  }
}
