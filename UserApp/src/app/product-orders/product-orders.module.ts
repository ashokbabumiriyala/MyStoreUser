import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductOrdersPageRoutingModule } from './product-orders-routing.module';

import { ProductOrdersPage } from './product-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductOrdersPageRoutingModule
  ],
  declarations: [ProductOrdersPage]
})
export class ProductOrdersPageModule {}
