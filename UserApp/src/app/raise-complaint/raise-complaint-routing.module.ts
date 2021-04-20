import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaiseComplaintPage } from './raise-complaint.page';

const routes: Routes = [
  {
    path: '',
    component: RaiseComplaintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaiseComplaintPageRoutingModule {}
