import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonApiServiceCallsService } from '../Shared/common-api-service-calls.service';
import { HelperService } from 'src/app/common/helper.service';
import { StorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategorySearchService {
  private apiUrl = environment.userOperationServiceUrl;
  private cartItems = [];
  constructor(
    private commonApiServiceCallsService: CommonApiServiceCallsService,
    private helperService: HelperService,
    private storageService: StorageService
  ) {
    this.helperService.getCartItems().subscribe((cartItems) => {
      if (cartItems != null) {
        this.cartItems = cartItems;
      }
    });
  }
  getCartItems(methodName: string, data: any): Observable<any> {
    return this.commonApiServiceCallsService.select(
      this.apiUrl + methodName,
      data
    );
  }

  getCategories(): Observable<any> {
    return this.commonApiServiceCallsService.getAll(this.apiUrl + "StoreCategoriesSelect");
  }

  getStoreDetailsByProduct(methodName: string, data: any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, data);
  }

  getProducts(searchString: string): Observable<any> {
    return this.commonApiServiceCallsService.getCustom(this.apiUrl + "GetProducts", { searchKey: searchString });
  }

  searchFromHome(methodName: string): Observable<any> {
    return this.commonApiServiceCallsService.getAll(this.apiUrl + methodName);
  }

  async insertCartItems(methodName: string): Promise<Observable<any>> {
    const dataObject = {
      UserId: Number(await this.storageService.get('UserId')),
      ServiceLocationId: 0,
      StoreId: 0,
      ProductCartItems: [],
      ServiceCartItems: [],
    };
    if (this.cartItems[0]?.storeID) {
      dataObject['StoreId'] = this.cartItems[0].storeID;
      this.cartItems.forEach((item) => {
        let data = {
          ProductID: item.productID,
          ProductName: item.productName,
          Quantity: String(item.itemCount),
          Units: item.units,
          PriceAfterDiscount: item.priceAfterDiscount,
          DiscountType: item.discountType,
          Discount: item.discount,
          PriceBeforeDiscount: item.priceBeforeDiscount,
        };
        dataObject['ProductCartItems'].push(data);
      });
    } else if (this.cartItems[0]?.locationID) {
      dataObject['ServiceLocationId'] = this.cartItems[0].locationID;

      this.cartItems.forEach((item) => {
        let data = {
          ServiceId: Number(item.serviceId),
          BusinessName: item.businessName,
          PriceAfterDiscount: Number(item.priceAfterDiscount),
          PriceBeforeDiscount: Number(item.priceBeforeDiscount),
          DiscountType: String(item.discountType),
          Discount: item.discount,
        };
        dataObject['ServiceCartItems'].push(data);
      });
    }
    return this.commonApiServiceCallsService.select(
      this.apiUrl + methodName,
      dataObject
    );
  }
}
