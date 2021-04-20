import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceOrdersPage } from './service-orders.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceOrdersPageRoutingModule {}
