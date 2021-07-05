import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
import { CommonApiServiceCallsService} from '../Shared/common-api-service-calls.service';
@Injectable({
  providedIn: 'root'
})
export class ServiceInfoService {
  private apiUrl = environment.userOperationServiceUrl;
  constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) { }
  getServiceInfoList(methodName: string,resource:any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName,resource);
  }
}
