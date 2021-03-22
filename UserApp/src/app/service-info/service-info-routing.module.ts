import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceInfoPage } from './service-info.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceInfoPageRoutingModule {}
