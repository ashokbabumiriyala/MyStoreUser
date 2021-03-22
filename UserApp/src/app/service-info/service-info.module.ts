import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceInfoPageRoutingModule } from './service-info-routing.module';

import { ServiceInfoPage } from './service-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceInfoPageRoutingModule
  ],
  declarations: [ServiceInfoPage]
})
export class ServiceInfoPageModule {}
