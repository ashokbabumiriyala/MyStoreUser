import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CommonApiServiceCallsService } from '../Shared/common-api-service-calls.service';

@Injectable({
  providedIn: 'root',
})
export class VirtualFootFallService {
  isAuthenticated = false;
  token: string;

  private updateProductDataClicksUrl: string;
  private updateStoreDataClicksUrl: string;
  private getStoreDataClicksUrl: string;
  private getProductDataClicksUrl: string;

  constructor(
    private commonApiServiceCallsService: CommonApiServiceCallsService
  ) {
    this.updateProductDataClicksUrl =
      environment.virutalFootFallUrl + 'UpdateProductDataClicks';
    this.updateStoreDataClicksUrl =
      environment.virutalFootFallUrl + 'UpdateStoreDataClicks';
    this.getProductDataClicksUrl =
      environment.virutalFootFallUrl + 'GetProductDataClicks';
    this.getStoreDataClicksUrl =
      environment.virutalFootFallUrl + 'GetStoreDataClicks';
  }

  public updateProductDataClicks(
    userId: number,
    productId: number
  ): Observable<any> {
    return this.commonApiServiceCallsService
      .select(this.updateProductDataClicksUrl, {
        userId: +userId,
        productId: +productId,
      })
      .pipe(catchError((error) => this.handleUpdateProductDataClicks(error)));
  }

  handleUpdateProductDataClicks(error: any): any {
    console.log(`failed to update product data clicks, error: ${error}`);
  }

  public updateStoreDataClicks(
    userId: number,
    storeLocationId: number
  ): Observable<any> {
    return this.commonApiServiceCallsService
      .select(this.updateStoreDataClicksUrl, {
        userId: +userId,
        storeLocationId: +storeLocationId,
      })
      .pipe(catchError((error) => this.handleUdateStoreDataClicks(error)));
  }

  handleUdateStoreDataClicks(error: any): any {
    console.log(`failed to update store data clicks, error: ${error}`);
  }

  public getStoreDataClicks(storeLocationId: number): Observable<any> {
    return this.commonApiServiceCallsService
      .get(this.getStoreDataClicksUrl, storeLocationId)
      .pipe(catchError((error) => this.handleGetStoreDataClicks(error)));
  }

  handleGetStoreDataClicks(error: any): any {
    console.log(`failed to get store data clicks, error: ${error}`);
  }

  public getProductDataClicks(storeLocationId: number): Observable<any> {
    return this.commonApiServiceCallsService
      .get(this.getProductDataClicksUrl, storeLocationId)
      .pipe(catchError((error) => this.handleGetProductDataClicks(error)));
  }

  handleGetProductDataClicks(error: any): any {
    console.log(`failed to get product data clicks, error: ${error}`);
  }
}
