import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceOrdersPageRoutingModule } from './service-orders-routing.module';

import { ServiceOrdersPage } from './service-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceOrdersPageRoutingModule
  ],
  declarations: [ServiceOrdersPage]
})
export class ServiceOrdersPageModule {}
