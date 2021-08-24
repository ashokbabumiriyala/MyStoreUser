import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceOrdersPageRoutingModule } from './service-orders-routing.module';

import { ServiceOrdersPage } from './service-orders.page';
import { ServiceOrderRowExpandComponent } from './service-order-row-expand/service-order-row-expand.component';
import { CustomDateTimeModule } from '../Shared/custom-datetime/customdatetime.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceOrdersPageRoutingModule,
    CustomDateTimeModule
  ],
  declarations: [ServiceOrdersPage, ServiceOrderRowExpandComponent]
})
export class ServiceOrdersPageModule { }
