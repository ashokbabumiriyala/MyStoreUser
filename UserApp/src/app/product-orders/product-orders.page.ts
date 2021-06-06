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
  expand:boolean = false;
  constructor( private router: Router, private helperService: HelperService, private productOrderService: ProductOrderService) { }

  ngOnInit() {
    // this.orderedItems = [
    //   { name: 'store 1', date: '10/01/2021', orderId: 25678, status: 'Delivered', expand:false},
    //   { name: 'store 2', date: '15/05/2021', orderId: 52345, status: 'Pending', expand:false},
    //   { name: 'store 3', date: '10/05/2021', orderId: 25698, status: 'Delivered', expand:false}
    // ];
    this.loadProductOrders();
  }
  async loadProductOrders(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    const dataObject={"UserId": Number(sessionStorage.getItem('UserId'))};
    await this.productOrderService.getProductOrders('UserProductOrders', dataObject)
    .subscribe((data: any) => {
      this.orderedItems = data.productorders;
      this.orderedItems.forEach(element => {
        element['expand'] = false;
      });
      loadingController.dismiss();
    },
    (error: any) => {
      loadingController.dismiss();
    });
  }
  expandItem(event, ele): void {
    event.currentTarget.classList.toggle('order-status');
    event.currentTarget.classList.toggle('row-icon');
    if (ele.expand) {
      ele.expand = false;
    } else {
      ele.expand = true;
    }
  }
  trackStatus() {
    this.router.navigate(['/service-orders']);
  }
}
