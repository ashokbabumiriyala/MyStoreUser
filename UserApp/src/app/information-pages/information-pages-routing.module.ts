import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformationPagesPage } from './information-pages.page';

import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';
import { RefundsAndCancellationComponent } from './refunds-and-cancellation/refunds-and-cancellation.component' ;
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { ShippingPoliciesComponent } from './shipping-policies/shipping-policies.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'privacy-policies',
    component: PrivacyPoliciesComponent
  },
  {
    path: 'refunds-cancellation',
    component: RefundsAndCancellationComponent
  },
  {
    path: 'terms-conditions',
    component: TermsandconditionsComponent
  },
  {
    path: 'shipping-policies',
    component: ShippingPoliciesComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformationPagesPageRoutingModule {}
