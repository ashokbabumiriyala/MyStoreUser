import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HelperService } from '../common/helper.service';
import { ProductOrderService } from './product-order.service';

@Component({
  selector: 'app-product-orders',
  templateUrl: './product-orders.page.html',
  styleUrls: ['./product-orders.page.scss'],
})
export class ProductOrdersPage implements OnInit {
  storeName:any = "Big Basket";
  orderedDate:any = new Date();
  orderId:any = 12345;
  deliveryStatus:any = 'On the way';
  orderedItems:any = [];
  orders:any = [];
  expand:boolean = false;
  showStoreOrders:boolean;
  stores:[];
  constructor( private router: Router, private helperService: HelperService, private productOrderService: ProductOrderService) { }

  ngOnInit() {
    this.loadProductOrders();
  }
  async loadProductOrders(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={"UserId": Number(sessionStorage.getItem('UserId'))};
    await this.productOrderService.getProductOrders('UserProductOrders', dataObject)
    .subscribe((data: any) => {
      this.orders = data.productorders;     
      loadingController.dismiss();
    },
    (error: any) => {
      loadingController.dismiss();
    });
  }
  expandItem(event, ele): void {  
    this.orderedItems=[];
    this.showStoreOrders=false;    
    if (ele.expand) {
      ele.expand = false;
      this.showStoreOrders=false;
    } else {
      ele.expand = true;
      this.getOrderItems(ele.orderID);   
    }
  }
  trackStatus() {
    this.router.navigate(['/service-orders']);
  }
  async getOrderItems(orderId:string)
  {   
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present(); 
    const dataObject={OrderId: orderId};
    await  this.productOrderService.getOrderItems('UserProductOrderItems',dataObject)
          .subscribe((data: any) => {
           this.orderedItems=data.productorders;         
           this.showStoreOrders=true;
           loadingController.dismiss();
          },
            (error: any) => {   
              loadingController.dismiss();
          });
  }
}
