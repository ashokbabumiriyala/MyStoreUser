import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PushTokenService {
  isAuthenticated = false;
  token: string;
  private apiUrl;
  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.pushTokenServiceUrl + 'UpdatePushToken';
  }

  public registerPushToken(token: string): Observable<any> {
    return this.httpClient
      .post(this.apiUrl, token)
      .pipe(catchError((error) => this.handleRegisterTokenError(error)));
  }

  handleRegisterTokenError(error: any): any {
    console.log(`failed to register push token, error: ${error}`);
  }
}
