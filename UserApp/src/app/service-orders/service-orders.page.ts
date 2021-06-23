import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { $ } from 'protractor';

import { HelperService } from '../common/helper.service';
import { ServiceOrderService } from './service-order.service';
@Component({
  selector: 'app-service-orders',
  templateUrl: './service-orders.page.html',
  styleUrls: ['./service-orders.page.scss'],
})
export class ServiceOrdersPage implements OnInit {
  storeName: any = "Plumber";
  orderedDate: any = new Date();
  orderId: any = 12345;
  deliveryStatus: any = 'Completed';
  orderedItems: any = [];
  orders:any=[];
  showStoreOrders:boolean;
  selectedIndex: any;
  constructor(private router: Router, private helperService: HelperService, private serviceOrderService: ServiceOrderService) { }

  ngOnInit() { 
    this.loadServiceOrders();
  }
  async loadServiceOrders(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={"UserId": Number(sessionStorage.getItem('UserId'))};
    await this.serviceOrderService.getServiceOrders('UserServiceOrders', dataObject)
    .subscribe((data: any) => {
      this.orders = data.serviceOrders;
      loadingController.dismiss();
    },
    (error: any) => {
      loadingController.dismiss();
    });
  }
  expandItem(event, ele:any, index:number): void {  
    this.orderedItems=[];
    this.showStoreOrders=false;    
    if (ele.expand) {
      ele.expand = false;
      this.showStoreOrders=false;
      this.selectedIndex = -1;
    } else {     
      this.orders.forEach(element => {element.expand = false;});
      ele.expand = true;
      this.selectedIndex = index;
      this.getOrderItems(ele.orderID);   
    }
  }

  async getOrderItems(orderId:string)
  {   
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present(); 
    const dataObject={OrderId: orderId};
    await  this.serviceOrderService.getOrderItems('UserServiceOrderItems',dataObject)
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
