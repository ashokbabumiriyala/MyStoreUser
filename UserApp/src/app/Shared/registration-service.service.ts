import { Injectable } from '@angular/core';
import {CommonApiServiceCallsService} from '../Shared/common-api-service-calls.service';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RegistrationServiceService {
  private apiUrl = environment.authenticationServiceUrl;
  constructor(private commonApiServiceCallsService:CommonApiServiceCallsService,
    private http:HttpClient) { }

  validateUser(methodName: string, resouce: any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, resouce);
  }
  retrieveUserNameOrPassword(methodName: string, resouce: any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, resouce);
  }

}
