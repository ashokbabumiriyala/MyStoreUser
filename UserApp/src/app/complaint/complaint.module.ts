import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplaintPageRoutingModule } from './complaint-routing.module';

import { ComplaintPage } from './complaint.page';
import { CustomDateTimeModule } from '../Shared/custom-datetime/customdatetime.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComplaintPageRoutingModule,
    CustomDateTimeModule
  ],
  declarations: [ComplaintPage]
})
export class ComplaintPageModule { }
