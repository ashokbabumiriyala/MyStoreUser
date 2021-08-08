import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AnimationController } from '@ionic/angular';

import { HelperService } from '../common/helper.service';
import { StorageService } from '../common/storage.service';
import { ProductOrderService } from './product-order.service';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { AnyAaaaRecord } from 'dns';

@Component({
  selector: 'app-product-orders',
  templateUrl: './product-orders.page.html',
  styleUrls: ['./product-orders.page.scss'],
})
export class ProductOrdersPage implements OnInit {
  storeName: any = 'Big Basket';
  orderedDate: any = new Date();
  orderId: any = 12345;
  deliveryStatus: any = 'On the way';
  orderedItems: any = [];
  orders: any = [];
  expand: boolean = false;
  showStoreOrders: boolean;
  stores: [];
  selectedIndex: number;
  dataIsAvilable: boolean = false;
 

  constructor(
    private router: Router,
    private helperService: HelperService,
    private productOrderService: ProductOrderService,
    private storageService: StorageService,
    public animationCtrl: AnimationController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadProductOrders();
  }
  async loadProductOrders() {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObject = {
      UserId: Number(await this.storageService.get('UserId')),
    };
    await this.productOrderService
      .getProductOrders('UserProductOrders', dataObject)
      .subscribe(
        (data: any) => {
          this.orders = data.productorders;
          loadingController.dismiss();
        },
        (error: any) => {
          loadingController.dismiss();
        }
      );
  }
  async viewReceipt(order:any) {
     const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
      const wrapperAnimation = this.animationCtrl
        .create()
        .beforeStyles({
          opacity: 1,
          height: '83%',
          width: 'auto',
          'min-width': '96vw',
          'margin-top': '6%',
        })
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .fromTo('transform', 'scale(0)', 'scale(1)');

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };
    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };
    const modal = await this.modalController.create({
      component: OrderInvoiceComponent,
      componentProps: { orderedItemsList: this.orderedItems, orderItem: order },
      enterAnimation,
      leaveAnimation,
    });
    return await modal.present();
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
      this.getOrderItems(ele, 'no');
    }
  }
  trackStatus() {
    this.router.navigate(['/service-orders']);
  }
  async getOrderItems(order: any, invoice:any) {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    await loadingController.present();
    const dataObject = { OrderId: order.orderID };
    await this.productOrderService
      .getOrderItems('UserProductOrderItems', dataObject)
      .subscribe(
        (data: any) => {
          this.orderedItems = data.productorders;
          this.showStoreOrders = true;
          loadingController.dismiss();
          this.dataIsAvilable = true;
        },
        (error: any) => {
          loadingController.dismiss();
          this.dataIsAvilable = true;
        },
        () => {
          if(invoice == 'yes')
             this.viewReceipt(order);   
        }
      );
  }
}
