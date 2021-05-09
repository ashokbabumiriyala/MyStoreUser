import { Injectable } from '@angular/core';
import {CommonApiServiceCallsService} from '../common-api-service-calls.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignUpService {
private apiUrl = environment.authenticationServiceUrl;
constructor(private commonApiServiceCallsService:CommonApiServiceCallsService) { }

  providerType(methodName: string): Observable<any> {
  return this.commonApiServiceCallsService.getAll(this.apiUrl + methodName);
  }

  providerSignUp(methodName: string,resource:any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName,resource);
    }

}
