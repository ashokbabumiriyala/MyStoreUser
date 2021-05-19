import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationPagesPageRoutingModule } from './information-pages-routing.module';

import { InformationPagesPage } from './information-pages.page';

import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';
import { RefundsAndCancellationComponent } from './refunds-and-cancellation/refunds-and-cancellation.component' ;
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { ShippingPoliciesComponent } from './shipping-policies/shipping-policies.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformationPagesPageRoutingModule
  ],
  declarations: [InformationPagesPage, AboutUsComponent, ContactUsComponent, PrivacyPoliciesComponent,
  RefundsAndCancellationComponent, TermsandconditionsComponent, ShippingPoliciesComponent]
})
export class InformationPagesPageModule {}
