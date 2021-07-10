import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonApiServiceCallsService } from '../Shared/common-api-service-calls.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = environment.userOperationServiceUrl;
  constructor(
    private commonApiServiceCallsService: CommonApiServiceCallsService
  ) {}
  insertOrderList(methodName: string, data: any): Observable<any> {
    return this.commonApiServiceCallsService.select(
      this.apiUrl + methodName,
      data
    );
  }

  getCheckOutAddress(methodName: string, data: any): Observable<any> {
    return this.commonApiServiceCallsService.select(
      this.apiUrl + methodName,
      data
    );
  }

  getStoreDetails(methodName: string, locationId: number): Observable<any> {
    return this.commonApiServiceCallsService.get(
      this.apiUrl + methodName,
      locationId
    );
  }
}
