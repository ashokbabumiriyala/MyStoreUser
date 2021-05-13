import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
import { CommonApiServiceCallsService} from '../Shared/common-api-service-calls.service';
@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  private apiUrl = environment.userOperationServiceUrl;
  constructor(private commonApiServiceCallsService: CommonApiServiceCallsService) { }
  getProductList(methodName: string, data:any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, data);
  }
}
