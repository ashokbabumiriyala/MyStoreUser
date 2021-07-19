import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CommonApiServiceCallsService } from '../Shared/common-api-service-calls.service';

@Injectable({
  providedIn: 'root',
})
export class PushTokenService {
  isAuthenticated = false;
  token: string;
  private registerUserPushTokenUrl: string;
  constructor(
    private commonApiServiceCallsService: CommonApiServiceCallsService
  ) {
    this.registerUserPushTokenUrl =
      environment.pushTokenServiceUrl + 'UpdateUserPushToken';
  }

  public registerUserPushToken(userId: number, token: string): Observable<any> {
    return this.commonApiServiceCallsService
      .select(this.registerUserPushTokenUrl, {
        userId: +userId,
        pushToken: token,
      })
      .pipe(catchError((error) => this.handleRegisterTokenError(error)));
  }

  handleRegisterTokenError(error: any): any {
    console.log(`failed to register push token, error: ${error}`);
  }
}
