import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
import { CommonApiServiceCallsService} from '../Shared/common-api-service-calls.service';
@Injectable({
  providedIn: 'root'
})
export class ProductInfoService {
  private apiUrl = environment.userOperationServiceUrl;
  constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) { }
  getMerchantList(methodName: string): Observable<any> {
    return this.commonApiServiceCallsService.getAll(this.apiUrl + methodName);
  }
}
