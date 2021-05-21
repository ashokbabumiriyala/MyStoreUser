import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';
import { CommonApiServiceCallsService} from '../Shared/common-api-service-calls.service';
import { HelperService} from 'src/app/common/helper.service';

@Injectable({
  providedIn: 'root'
})
export class CategorySearchService {
  private apiUrl = environment.userOperationServiceUrl;
  private cartItems = [];
  constructor(private commonApiServiceCallsService: CommonApiServiceCallsService, private helperService: HelperService) {
    this.helperService.getCartItems().subscribe(cartItems => {
      if(cartItems!=null){
        this.cartItems = cartItems;
      }
    });
   }
  getCartItems(methodName: string, data:any): Observable<any> {
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, data);
  }
  insertCartItems(methodName: string): Observable<any> {
    const dataObject={UserId: Number(sessionStorage.getItem('UserId')), ServiceLocationId: null, StoreId : null,
       ProductCartItems: [], ServiceCartItems: []};
       if (this.cartItems[0]?.storeID) {
        dataObject['StoreId'] = this.cartItems[0].storeID;
        this.cartItems.forEach(item => {
          let data = {ProductID: item.productID,
            ProductName: item.productName,
            Quantity : String(item.itemCount),
            Units: item.units,
            PriceAfterDiscount : item.priceAfterDiscount,
            DiscountType: item.discountType,
            Discount : item.discount,
            PriceBeforeDiscount : item.priceBeforeDiscount
          };
          dataObject['ProductCartItems'].push(data)
        })
       } else if (this.cartItems[0]?.locationID){
        dataObject['ServiceLocationId'] = this.cartItems[0].locationID;
        this.cartItems.forEach(item => {
          let data = {ServiceId : item.serviceId,
            BusinessName : item.businessName ,
            PriceAfterDiscount : item.priceAfterDiscount,
            DiscountType: item.discountType,
            Discount : item.discount,
            PriceBeforeDiscount : item.priceBeforeDiscount
          };
          dataObject['ServiceCartItems'].push(data)
       });
      }
    return this.commonApiServiceCallsService.select(this.apiUrl + methodName, dataObject);
  }
}
