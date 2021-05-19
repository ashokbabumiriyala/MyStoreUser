import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductOrdersPageRoutingModule } from './product-orders-routing.module';

import { ProductOrdersPage } from './product-orders.page';
import { ProductOrderRowExpandComponent } from './product-order-row-expand/product-order-row-expand.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductOrdersPageRoutingModule
  ],
  declarations: [ProductOrdersPage,ProductOrderRowExpandComponent]
})
export class ProductOrdersPageModule {}
