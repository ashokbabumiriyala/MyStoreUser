import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../common/helper.service';
import { ServiceInfoService } from '../service-info/service-info.service';

import {iDataTransferBetweenPages}  from '../common/data-transfer-between-pages';

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.page.html',
  styleUrls: ['./service-info.page.scss'],
})
export class ServiceInfoPage implements OnInit {
  serviceInfoList = [];
  iDataTransferBetweenPages: iDataTransferBetweenPages;
  constructor(private router:Router, private serviceInfoService: ServiceInfoService,
    private helperService: HelperService) { }

  ngOnInit() {
    this.getserviceInfoList();
  }
  async getserviceInfoList(){
    const loadingController = await this.helperService.createLoadingController("loading");
    await loadingController.present();
    await this.serviceInfoService.getServiceInfoList('UserServiceSelect')
    .subscribe((data: any) => {     
      this.serviceInfoList = data;     
      loadingController.dismiss();
    },
    (error: any) => {
      loadingController.dismiss();
    });

  }
  getServices(service) {
    // this.router.navigate(['/service-list'], {queryParams: {serviceId: service.serviceLocationID}})
    this.iDataTransferBetweenPages = { serviceId: Number(service.serviceLocationID) };
    this.helperService.navigateWithData(['service-list'], this.iDataTransferBetweenPages);
  }
}
