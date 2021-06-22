import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = false;
  token: string;
  constructor(private httpClient: HttpClient) { }
  AuthenticateUser(apiUrl: string, user: any): Observable<any> {
    this.isAuthenticated = true;
    return this.httpClient
      .post(apiUrl, user)
      .pipe(catchError(error => this.handleAuthenticationError(error)));
  }
  private handleAuthenticationError(error: Response) {
    this.isAuthenticated = false;

    if (error.status === 401) {
    }

    if (error.status === 404) {
     console.log(error);
    }

    if (error.status === 400) {
      console.log(error);
    }

    if (error.status === 202) {
      console.log(error);
    }

    return throwError(console.log(error));
  }
}
