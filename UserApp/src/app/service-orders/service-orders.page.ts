import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { $ } from 'protractor';

import { HelperService } from '../common/helper.service';
import { StorageService } from '../common/storage.service';
import { ServiceOrderService } from './service-order.service';
@Component({
  selector: 'app-service-orders',
  templateUrl: './service-orders.page.html',
  styleUrls: ['./service-orders.page.scss'],
})
export class ServiceOrdersPage implements OnInit {
  storeName: any = 'Plumber';
  orderedDate: any = new Date();
  deliveryStatus: any = 'Completed';
  orderedItems: any = [];
  orders: any = [];
  showStoreOrders: boolean;
  selectedIndex: any;
  constructor(
    private router: Router,
    private helperService: HelperService,
    private serviceOrderService: ServiceOrderService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadServiceOrders();
  }
  async loadServiceOrders() {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObject = {
      UserId: Number(await this.storageService.get('UserId')),
    };
    await this.serviceOrderService
      .getServiceOrders('UserServiceOrders', dataObject)
      .subscribe(
        (data: any) => {
          this.orders = data.serviceOrders;
          loadingController.dismiss();
        },
        (error: any) => {
          loadingController.dismiss();
        }
      );
  }
  expandItem(event, ele: any, index: number): void {
    this.orderedItems = [];
    this.showStoreOrders = false;
    if (ele.expand) {
      ele.expand = false;
      this.showStoreOrders = false;
      this.selectedIndex = -1;
    } else {
      this.orders.forEach((element) => {
        element.expand = false;
      });
      ele.expand = true;
      this.selectedIndex = index;
      this.getOrderItems(ele.orderID);
    }
  }

  async getOrderItems(orderId: string) {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObject = { OrderId: orderId };
    await this.serviceOrderService
      .getOrderItems('UserServiceOrderItems', dataObject)
      .subscribe(
        (data: any) => {
          this.orderedItems = data.serviceOrders;
          this.showStoreOrders = true;
          loadingController.dismiss();
        },
        (error: any) => {
          loadingController.dismiss();
        }
      );
  }
}
