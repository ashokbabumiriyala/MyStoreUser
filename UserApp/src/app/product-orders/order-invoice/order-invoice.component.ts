import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/common/storage.service';
import { HelperService } from '../../common/helper.service';
import { OrderInvoiceService } from './order-invoice.service';

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: ['./order-invoice.component.scss'],
})
export class OrderInvoiceComponent implements OnInit {
  orderedItemsList: any;
  userFullName: string;
  @Input() orderItem: any;
  constructor(
    public modalCtrl: ModalController,
    private helperService: HelperService,
    private orderInvoiceService: OrderInvoiceService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    const loadingController = await this.helperService.createLoadingController(
      'loading'
    );
    this.userFullName = await this.storageService.get('FullName');
    await loadingController.present();
    const dataObject = { OrderId: this.orderItem.orderID };
    this.orderInvoiceService
      .getOrderItems('UserProductOrderItems', dataObject)
      .subscribe(
        (data: any) => {
          console.log(data.productorders);
          this.orderedItemsList = data.productorders;
          loadingController.dismiss();
        },
        (error: any) => {
          loadingController.dismiss();
        }
      );
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
