import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
import { CommonApiServiceCallsService} from '../Shared/common-api-service-calls.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = environment.userOperationServiceUrl;

  constructor(private commonApiServiceCallsService:CommonApiServiceCallsService) { }
  getComplaints(methodName: string, resouce: any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, resouce);
  }
  raiseComplaint(methodName: string, resouce: any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, resouce);
  }
}
