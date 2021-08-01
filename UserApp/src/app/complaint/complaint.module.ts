import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplaintPageRoutingModule } from './complaint-routing.module';

import { ComplaintPage } from './complaint.page';
import { CustomDatetime } from '../Shared/customdatetime.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComplaintPageRoutingModule
  ],
  declarations: [ComplaintPage, CustomDatetime]
})
export class ComplaintPageModule {}
