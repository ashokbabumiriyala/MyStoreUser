import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductOrdersPageRoutingModule } from './product-orders-routing.module';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { ProductOrdersPage } from './product-orders.page';
import { ProductOrderRowExpandComponent } from './product-order-row-expand/product-order-row-expand.component';
import { CustomDatetime } from '../Shared/customdatetime.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductOrdersPageRoutingModule
  ],
  declarations: [OrderInvoiceComponent, ProductOrdersPage, ProductOrderRowExpandComponent,CustomDatetime]
})
export class ProductOrdersPageModule {}
